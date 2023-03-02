/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "../../lang/Object";
import { NotImplementedError } from "../../../NotImplementedError";
import { Comparable } from "../../lang/Comparable";
import { Locale } from "../../util/Locale";
import { ByteBuffer } from "../ByteBuffer";
import { CharBuffer } from "../CharBuffer";
import { IllegalCharsetNameException } from "./IllegalCharsetNameException";
import { CharsetDecoder } from "./CharsetDecoder";
import { CodingErrorAction } from "./CodingErrorAction";
import { CharsetEncoder } from "./CharsetEncoder";
import { JavaString } from "../../lang/String";

/**
 * A named mapping between sequences of sixteen-bit Unicode code units and sequences of bytes. This class defines
 * methods for creating decoders and encoders and for retrieving the various names associated with a charset.
 * Instances of this class are immutable.
 *
 * Note: this implementation comes without provider support. Instead there's a fixed set of supported encodings
 *       provided by the Node.js Buffer API, which supports all Java standard charsets, except UTF-16LE.
 *       It is not an abstract class as in Java, but implements the encoder/decoder methods directly.
 */
export class Charset extends JavaObject implements Comparable<Charset> {
    private static readonly default: Charset;

    // Supported encoding names + their aliases.
    private static readonly supportedEncodings = new Map<string, Set<string>>([
        ["ascii", new Set(["us-ascii", "iso646-us"])],
        ["latin1", new Set(["iso-8859-1", "iso-latin-1"])],
        ["utf-8", new Set(["utf8"])],
        ["utf16le", new Set(["utf-16le"])],
        ["utf16", new Set(["ucs2", "ucs-2"])],
        ["base64", new Set()],
        ["base64url", new Set()],
        ["binary", new Set()],
        ["hex", new Set()],
    ]);

    #alternatives: Set<string>;
    #canonicalName: string;

    protected constructor(canonicalName: BufferEncoding) {
        super();

        this.#canonicalName = canonicalName;
        const alts = Charset.supportedEncodings.get(canonicalName);
        if (!alts) {
            throw new IllegalCharsetNameException();
        }

        this.#alternatives = alts;
    }

    /**
     * Constructs a sorted map from canonical charset names to charset objects.
     */
    public static availableCharsets(): Map<string, Charset> {
        throw new NotImplementedError();
    }

    /** @returns The default charset. */
    public static defaultCharset(): Charset {
        return Charset.default;
    }

    /**
     * Returns a charset object for the named charset. If the charset object
     * for the named charset is not available or {@code charsetName} is not a
     * legal charset name, then {@code fallback} is returned.
     *
     * @param  charsetName
     *         The name of the requested charset; may be either
     *         a canonical name or an alias
     *
     * @returns  A charset object for the named charset, or {@code fallback}
     *          in case the charset object for the named charset is not
     *          available or {@code charsetName} is not a legal charset name
     */
    public static forName(charsetName: JavaString): Charset | null {
        const native = `${charsetName}`;
        let name = Charset.supportedEncodings.has(native) ? native : undefined;

        if (!name) {
            // Name not directly found. Check the aliases.
            for (const [key, value] of Charset.supportedEncodings) {
                if (value.has(native)) {
                    name = key;
                    break;
                }
            }
        } else {
            name = native;
        }

        if (!name) {
            return null;
        }

        return new Charset(name as BufferEncoding);
    }

    /**
     * Tells whether the named charset is supported.
     *
     * @param  charsetName
     *         The name of the requested charset; may be either
     *         a canonical name or an alias
     *
     * @returns True if, and only if, support for the named charset
     *          is available in the current Java virtual machine
     */
    public static isSupported(charsetName: JavaString): boolean {
        if (Charset.supportedEncodings.has(charsetName.valueOf())) {
            return true;
        }

        for (const [_, aliases] of Charset.supportedEncodings) {
            if (aliases.has(charsetName.valueOf())) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns this charset's canonical name.
     *
     * @returns  The canonical name of this charset
     */
    public name(): JavaString {
        return new JavaString(this.#canonicalName);
    }

    /**
     * Returns a set containing this charset's aliases.
     *
     * @returns  An immutable set of this charset's aliases
     */
    public aliases(): Set<string> {
        return this.#alternatives;
    }

    /**
     * Returns this charset's human-readable name for the default locale.
     *
     * <p> The default implementation of this method simply returns this
     * charset's canonical name.  Concrete subclasses of this class may
     * override this method in order to provide a localized display name. </p>
     *
     * @param locale tbd
     *
     * @returns  The display name of this charset in the default locale
     */
    public displayName(locale?: Locale): JavaString {
        return new JavaString(this.#canonicalName);
    }

    /**
     * Tells whether or not this charset is registered in the <a
     * href="http://www.iana.org/assignments/character-sets">IANA Charset
     * Registry</a>.
     *
     * @returns  True if, and only if, this charset is known by its
     *          implementor to be registered with the IANA
     */
    public isRegistered(): boolean {
        return true;
    }

    /**
     * Tells whether or not this charset supports encoding.
     *
     * <p> Nearly all charsets support encoding.  The primary exceptions are
     * special-purpose <i>auto-detect</i> charsets whose decoders can determine
     * which of several possible encoding schemes is in use by examining the
     * input byte sequence.  Such charsets do not support encoding because
     * there is no way to determine which encoding should be used on output.
     * Implementations of such charsets should override this method to return
     * {@code false}. </p>
     *
     * @returns True if, and only if, this charset supports encoding
     */
    public canEncode(): boolean {
        return true;
    }

    /**
     * Convenience method that decodes bytes in this charset into Unicode
     * characters.
     *
     * <p> An invocation of this method upon a charset {@code cs} returns the
     * same result as the expression
     *
     * <pre>
     *     cs.newDecoder()
     *       .onMalformedInput(CodingErrorAction.REPLACE)
     *       .onUnmappableCharacter(CodingErrorAction.REPLACE)
     *       .decode(bb); </pre>
     *
     * except that it is potentially more efficient because it can cache
     * decoders between successive invocations.
     *
     * <p> This method always replaces malformed-input and unmappable-character
     * sequences with this charset's default replacement byte array.  In order
     * to detect such sequences, use the {@link
     * CharsetDecoder#decode(ByteBuffer)} method directly.  </p>
     *
     * @param  bb  The byte buffer to be decoded
     *
     * @returns  A char buffer containing the decoded characters
     */
    public decode(bb: ByteBuffer): CharBuffer {
        return this.newDecoder()
            .onMalformedInput(CodingErrorAction.REPLACE)
            .onUnmappableCharacter(CodingErrorAction.REPLACE)
            .decode(bb);
    }

    /**
     * Convenience method that encodes Unicode characters into bytes in this
     * charset.
     *
     * <p> An invocation of this method upon a charset {@code cs} returns the
     * same result as the expression
     *
     * <pre>
     *     cs.newEncoder()
     *       .onMalformedInput(CodingErrorAction.REPLACE)
     *       .onUnmappableCharacter(CodingErrorAction.REPLACE)
     *       .encode(bb); </pre>
     *
     * except that it is potentially more efficient because it can cache
     * encoders between successive invocations.
     *
     * <p> This method always replaces malformed-input and unmappable-character
     * sequences with this charset's default replacement string.  In order to
     * detect such sequences, use the {@link
     * CharsetEncoder#encode(CharBuffer)} method directly.  </p>
     *
     * @param  cb  The char buffer to be encoded
     *
     * @returns  A byte buffer containing the encoded characters
     */
    public encode(cb: CharBuffer): ByteBuffer;
    /**
     * Convenience method that encodes a string into bytes in this charset.
     *
     * <p> An invocation of this method upon a charset {@code cs} returns the
     * same result as the expression
     *
     * <pre>
     *     cs.encode(CharBuffer.wrap(s)); </pre>
     *
     * @param  str  The string to be encoded
     *
     * @returns  A byte buffer containing the encoded characters
     */
    public encode(str: JavaString): ByteBuffer;
    public encode(bb: CharBuffer | JavaString): ByteBuffer {
        return this.newEncoder()
            .onMalformedInput(CodingErrorAction.REPLACE)
            .onUnmappableCharacter(CodingErrorAction.REPLACE)
            .encode(CharBuffer.wrap(bb));
    }

    /**
     * Compares this charset to another.
     *
     * @param that The charset to which this charset is to be compared
     */
    public compareTo(that: Charset): number {
        throw new NotImplementedError();
    }

    /**
     * Computes a hash code for this charset.
     */
    public hashCode(): number {
        throw new NotImplementedError();
    }

    /**
     * Tells whether or not this object is equal to another.
     *
     * @param ob The object to which this object is to be compared
     */
    public equals(ob: unknown): boolean {
        throw new NotImplementedError();
    }

    /**
     * Returns a string describing this charset.
     */
    public toString(): string {
        throw new NotImplementedError();
    }

    /**
     * Tells whether or not this charset contains the given charset.
     *
     * <p> A charset <i>C</i> is said to <i>contain</i> a charset <i>D</i> if,
     * and only if, every character representable in <i>D</i> is also
     * representable in <i>C</i>.  If this relationship holds then it is
     * guaranteed that every string that can be encoded in <i>D</i> can also be
     * encoded in <i>C</i> without performing any replacements.
     *
     * <p> That <i>C</i> contains <i>D</i> does not imply that each character
     * representable in <i>C</i> by a particular byte sequence is represented
     * in <i>D</i> by the same byte sequence, although sometimes this is the
     * case.
     *
     * <p> Every charset contains itself.
     *
     * <p> This method computes an approximation of the containment relation:
     * If it returns {@code true} then the given charset is known to be
     * contained by this charset; if it returns {@code false}, however, then
     * it is not necessarily the case that the given charset is not contained
     * in this charset.
     *
     * @param   cs
     *          The given charset
     *
     * @returns  True if the given charset is contained in this charset
     */
    public contains(cs: Charset): boolean {
        return false;
    }

    /**
     * Constructs a new decoder for this charset.
     *
     * @returns  A new decoder for this charset
     */
    public newDecoder(): CharsetDecoder {
        return CharsetDecoder.create(this);
    }

    /**
     * Constructs a new encoder for this charset.
     *
     * @returns  A new encoder for this charset
     *
     * @throws  UnsupportedOperationException
     *          If this charset does not support encoding
     */
    public newEncoder(): CharsetEncoder {
        return CharsetEncoder.create(this);
    }

    static {
        // @ts-expect-error
        Charset.defaultCharset = new Charset("utf-8");
    }

}
