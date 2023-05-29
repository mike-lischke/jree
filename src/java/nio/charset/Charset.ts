/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { MurmurHash } from "../../../MurmurHash";
import { NotImplementedError } from "../../../NotImplementedError";
import { Comparable } from "../../lang/Comparable";
import { JavaObject } from "../../lang/Object";
import { JavaString } from "../../lang/String";
import { HashSet } from "../../util/HashSet";
import { Locale } from "../../util/Locale";
import { JavaSet } from "../../util/Set";
import { SortedMap } from "../../util/SortedMap";
import { ByteBuffer } from "../ByteBuffer";
import { CharBuffer } from "../CharBuffer";
import { CharsetDecoder } from "./CharsetDecoder";
import { CharsetEncoder } from "./CharsetEncoder";
import { CodingErrorAction } from "./CodingErrorAction";
import { IllegalCharsetNameException } from "./IllegalCharsetNameException";

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
    // Encodings supported by the TextDecoder API.
    // From https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
    static readonly #encodingsMap: Map<string, string> = new Map([
        ["unicode-1-1-utf-8", "utf-8"],
        ["utf-8", "utf-8"],
        ["utf8", "utf-8"],
        ["866", "ibm866"],
        ["cp866", "ibm866"],
        ["csibm866", "ibm866"],
        ["ibm866", "ibm866"],
        ["csisolatin2", "iso-8859-2"],
        ["iso-8859-2", "iso-8859-2"],
        ["iso-ir-101", "iso-8859-2"],
        ["iso8859-2", "iso-8859-2"],
        ["iso88592", "iso-8859-2"],
        ["iso_8859-2", "iso-8859-2"],
        ["iso_8859-2:1987", "iso-8859-2"],
        ["l2", "iso-8859-2"],
        ["latin2", "iso-8859-2"],
        ["csisolatin3", "iso-8859-3"],
        ["iso-8859-3", "iso-8859-3"],
        ["iso-ir-109", "iso-8859-3"],
        ["iso8859-3", "iso-8859-3"],
        ["iso88593", "iso-8859-3"],
        ["iso_8859-3", "iso-8859-3"],
        ["iso_8859-3:1988", "iso-8859-3"],
        ["l3", "iso-8859-3"],
        ["latin3", "iso-8859-3"],
        ["csisolatin4", "iso-8859-4"],
        ["iso-8859-4", "iso-8859-4"],
        ["iso-ir-110", "iso-8859-4"],
        ["iso8859-4", "iso-8859-4"],
        ["iso88594", "iso-8859-4"],
        ["iso_8859-4", "iso-8859-4"],
        ["iso_8859-4:1988", "iso-8859-4"],
        ["l4", "iso-8859-4"],
        ["latin4", "iso-8859-4"],
        ["csisolatincyrillic", "iso-8859-5"],
        ["cyrillic", "iso-8859-5"],
        ["iso-8859-5", "iso-8859-5"],
        ["iso-ir-144", "iso-8859-5"],
        ["iso8859-5", "iso-8859-5"],
        ["iso88595", "iso-8859-5"],
        ["iso_8859-5", "iso-8859-5"],
        ["iso_8859-5:1988", "iso-8859-5"],
        ["arabic", "iso-8859-6"],
        ["asmo-708", "iso-8859-6"],
        ["csiso88596e", "iso-8859-6"],
        ["csiso88596i", "iso-8859-6"],
        ["csisolatinarabic", "iso-8859-6"],
        ["ecma-114", "iso-8859-6"],
        ["iso-8859-6", "iso-8859-6"],
        ["iso-8859-6-e", "iso-8859-6"],
        ["iso-8859-6-i", "iso-8859-6"],
        ["iso-ir-127", "iso-8859-6"],
        ["iso8859-6", "iso-8859-6"],
        ["iso88596", "iso-8859-6"],
        ["iso_8859-6", "iso-8859-6"],
        ["iso_8859-6:1987", "iso-8859-6"],
        ["csisolatingreek", "iso-8859-7"],
        ["ecma-118", "iso-8859-7"],
        ["elot_928", "iso-8859-7"],
        ["greek", "iso-8859-7"],
        ["greek8", "iso-8859-7"],
        ["iso-8859-7", "iso-8859-7"],
        ["iso-ir-126", "iso-8859-7"],
        ["iso8859-7", "iso-8859-7"],
        ["iso88597", "iso-8859-7"],
        ["iso_8859-7", "iso-8859-7"],
        ["iso_8859-7:1987", "iso-8859-7"],
        ["sun_eu_greek", "iso-8859-7"],
        ["csiso88598e", "iso-8859-8"],
        ["csisolatinhebrew", "iso-8859-8"],
        ["hebrew", "iso-8859-8"],
        ["iso-8859-8", "iso-8859-8"],
        ["iso-8859-8-e", "iso-8859-8"],
        ["iso-ir-138", "iso-8859-8"],
        ["iso8859-8", "iso-8859-8"],
        ["iso88598", "iso-8859-8"],
        ["iso_8859-8", "iso-8859-8"],
        ["iso_8859-8:1988", "iso-8859-8"],
        ["visual", "iso-8859-8"],
        ["csiso88598i", "iso-8859-8-i"],
        ["iso-8859-8-i", "iso-8859-8-i"],
        ["logical", "iso-8859-8-i"],
        ["csisolatin6", "iso-8859-10"],
        ["iso-8859-10", "iso-8859-10"],
        ["iso-ir-157", "iso-8859-10"],
        ["iso8859-10", "iso-8859-10"],
        ["iso885910", "iso-8859-10"],
        ["l6", "iso-8859-10"],
        ["latin6", "iso-8859-10"],
        ["iso-8859-13", "iso-8859-13"],
        ["iso8859-13", "iso-8859-13"],
        ["iso885913", "iso-8859-13"],
        ["iso-8859-14", "iso-8859-14"],
        ["iso8859-14", "iso-8859-14"],
        ["iso885914", "iso-8859-14"],
        ["csisolatin9", "iso-8859-15"],
        ["iso-8859-15", "iso-8859-15"],
        ["iso8859-15", "iso-8859-15"],
        ["iso885915", "iso-8859-15"],
        ["iso_8859-15", "iso-8859-15"],
        ["l9", "iso-8859-15"],
        ["latin9", "iso-8859-15"],
        ["iso-8859-16", "iso-8859-16"],
        ["cskoi8r", "koi8-r"],
        ["koi", "koi8-r"],
        ["koi8", "koi8-r"],
        ["koi8-r", "koi8-r"],
        ["koi8_r", "koi8-r"],
        ["koi8-ru", "koi8-u"],
        ["csmacintosh", "macintosh"],
        ["mac", "macintosh"],
        ["macintosh", "macintosh"],
        ["x-mac-roman", "macintosh"],
        ["dos-874", "windows-874"],
        ["iso-8859-11", "windows-874"],
        ["iso8859-11", "windows-874"],
        ["iso885911", "windows-874"],
        ["tis-620", "windows-874"],
        ["windows-874", "windows-874"],
        ["cp1250", "windows-1250"],
        ["windows-1250", "windows-1250"],
        ["x-cp1250", "windows-1250"],
        ["cp1251", "windows-1251"],
        ["windows-1251", "windows-1251"],
        ["x-cp1251", "windows-1251"],
        ["ansi_x3.4-1968", "windows-1252"],
        ["ascii", "windows-1252"],
        ["cp1252", "windows-1252"],
        ["cp819", "windows-1252"],
        ["csisolatin1", "windows-1252"],
        ["ibm819", "windows-1252"],
        ["iso-8859-1", "windows-1252"],
        ["iso-ir-100", "windows-1252"],
        ["iso8859-1", "windows-1252"],
        ["iso88591", "windows-1252"],
        ["iso_8859-1", "windows-1252"],
        ["iso_8859-1:1987", "windows-1252"],
        ["l1", "windows-1252"],
        ["latin1", "windows-1252"],
        ["us-ascii", "windows-1252"],
        ["windows-1252", "windows-1252"],
        ["x-cp1252", "windows-1252"],
        ["cp1253", "windows-1253"],
        ["windows-1253", "windows-1253"],
        ["x-cp1253", "windows-1253"],
        ["cp1254", "windows-1254"],
        ["csisolatin5", "windows-1254"],
        ["iso-8859-9", "windows-1254"],
        ["iso-ir-148", "windows-1254"],
        ["iso8859-9", "windows-1254"],
        ["iso88599", "windows-1254"],
        ["iso_8859-9", "windows-1254"],
        ["iso_8859-9:1989", "windows-1254"],
        ["l5", "windows-1254"],
        ["latin5", "windows-1254"],
        ["windows-1254", "windows-1254"],
        ["x-cp1254", "windows-1254"],
        ["cp1255", "windows-1255"],
        ["windows-1255", "windows-1255"],
        ["x-cp1255", "windows-1255"],
        ["cp1256", "windows-1256"],
        ["windows-1256", "windows-1256"],
        ["x-cp1256", "windows-1256"],
        ["cp1257", "windows-1257"],
        ["windows-1257", "windows-1257"],
        ["x-cp1257", "windows-1257"],
        ["cp1258", "windows-1258"],
        ["windows-1258", "windows-1258"],
        ["x-cp1258", "windows-1258"],
        ["x-mac-cyrillic", "x-mac-cyrillic"],
        ["x-mac-ukrainian", "x-mac-cyrillic"],
        ["chinese", "gbk"],
        ["csgb2312", "gbk"],
        ["csiso58gb231280", "gbk"],
        ["gb2312", "gbk"],
        ["gb_2312", "gbk"],
        ["gb_2312-80", "gbk"],
        ["gbk", "gbk"],
        ["iso-ir-58", "gbk"],
        ["x-gbk", "gbk"],
        ["gb18030", "gb18030"],
        ["hz-gb-2312", "hz-gb-2312"],
        ["big5", "big5"],
        ["big5-hkscs", "big5"],
        ["cn-big5", "big5"],
        ["csbig5", "big5"],
        ["x-x-big5", "big5"],
        ["cseucpkdfmtjapanese", "euc-jp"],
        ["euc-jp", "euc-jp"],
        ["x-euc-jp", "euc-jp"],
        ["csiso2022jp", "iso-2022-jp"],
        ["iso-2022-jp", "iso-2022-jp"],
        ["csshiftjis", "shift_jis"],
        ["ms_kanji", "shift_jis"],
        ["shift-jis", "shift_jis"],
        ["shift_jis", "shift_jis"],
        ["sjis", "shift_jis"],
        ["windows-31j", "shift_jis"],
        ["x-sjis", "shift_jis"],
        ["cseuckr", "euc-kr"],
        ["csksc56011987", "euc-kr"],
        ["euc-kr", "euc-kr"],
        ["iso-ir-149", "euc-kr"],
        ["korean", "euc-kr"],
        ["ks_c_5601-1987", "euc-kr"],
        ["ks_c_5601-1989", "euc-kr"],
        ["ksc5601", "euc-kr"],
        ["ksc_5601", "euc-kr"],
        ["windows-949", "euc-kr"],
        ["utf-16be", "utf-16be"],
        ["utf-16", "utf-16le"],
        ["utf-16le", "utf-16le"],
        ["x-user-defined", "x-user-defined"],
    ]);

    static readonly #default: Charset = new Charset("utf-8");

    #alternatives: Set<string>;
    #canonicalName: string;

    protected constructor(canonicalName: JavaString | string) {
        super();

        if (typeof canonicalName === "string") {
            this.#canonicalName = canonicalName.toLowerCase();
        } else {
            this.#canonicalName = canonicalName.valueOf().toLowerCase();
        }

        if (!Charset.#encodingsMap.has(this.#canonicalName)) {
            throw new IllegalCharsetNameException();
        }

        this.#alternatives = new Set<string>();
        Charset.#encodingsMap.forEach((value, key) => {
            if (value === this.#canonicalName) {
                this.#alternatives.add(key);
            }
        });
    }

    /**
     * Constructs a sorted map from canonical charset names to charset objects.
     */
    public static availableCharsets(): SortedMap<JavaString, Charset> {
        throw new NotImplementedError();
    }

    /** @returns The default charset. */
    public static defaultCharset(): Charset {
        return Charset.#default;
    }

    /**
     * Returns a charset object for the named charset.
     *
     * @param charsetName The name of the requested charset; may be either a canonical name or an alias.
     *
     * @returns A charset object for the named charset.
     *
     * @throws IllegalCharsetNameException If the given charset name is illegal.
     */
    public static forName(charsetName: JavaString | string): Charset {
        const name = charsetName.valueOf().toLowerCase();
        const canonicalName = Charset.#encodingsMap.get(name);

        if (!canonicalName) {
            throw new IllegalCharsetNameException(charsetName);
        }

        return new Charset(new JavaString(canonicalName));
    }

    /**
     * Tells whether or not the named charset is supported.
     *
     * @param charsetName The name of the charset
     *
     * @returns True if, and only if, support for the named charset is available in this instance of the Java virtual
     *          machine.
     */
    public static isSupported(charsetName: JavaString): boolean {
        return Charset.#encodingsMap.has(charsetName.valueOf());
    }

    /**
     * @returns a set containing this charset's aliases.
     */
    public aliases(): JavaSet<JavaString> {
        const result = new HashSet<JavaString>();
        this.#alternatives.forEach((value) => {
            result.add(new JavaString(value));
        });

        return result;
    }

    /**
     * Tells whether or not this charset supports encoding.
     *
     * @returns True if, and only if, this charset supports encoding
     */
    public canEncode(): boolean {
        return true;
    }

    /**
     * Compares this charset to another.
     *
     * @param that The charset to which this charset is to be compared
     *
     * @returns A negative integer, zero, or a positive integer as this charset
     */
    public compareTo(that: Charset): number {
        return this.#canonicalName.localeCompare(that.#canonicalName);
    }

    /**
     * Tells whether or not this charset contains the given charset.
     *
     * @param cs The charset to be tested
     *
     * @returns True if, and only if, this charset contains the given charset
     */
    public contains(cs: Charset): boolean {
        return this === cs;
    }

    /**
     * Convenience method that decodes bytes in this charset into Unicode characters.
     *
     * @param bb The byte buffer to decode
     *
     * @returns The decoded string
     */
    public decode(bb: ByteBuffer): CharBuffer {
        return this.newDecoder()
            .onMalformedInput(CodingErrorAction.REPLACE)
            .onUnmappableCharacter(CodingErrorAction.REPLACE)
            .decode(bb);
    }

    /** Returns this charset's human-readable name for the default locale. */
    public displayName(): JavaString;
    /** Returns this charset's human-readable name for the given locale. */
    public displayName(locale: Locale): JavaString;
    public displayName(...args: unknown[]): JavaString {
        return new JavaString(this.#canonicalName);
    }

    /** Convenience method that encodes a string into bytes in this charset. */
    public encode(str: JavaString): ByteBuffer;
    /** Convenience method that encodes Unicode characters into bytes in this charset. */
    public encode(cb: CharBuffer): ByteBuffer;
    public encode(bb: CharBuffer | JavaString): ByteBuffer {
        const buffer = bb instanceof CharBuffer ? bb : CharBuffer.wrap(bb);

        return this.newEncoder()
            .onMalformedInput(CodingErrorAction.REPLACE)
            .onUnmappableCharacter(CodingErrorAction.REPLACE)
            .encode(buffer);
    }

    /**
     * Tells whether or not this charset is equal to another.
     *
     * @param ob The object to which this charset is to be compared
     *
     * @returns True if, and only if, the given object is a charset that is
     */
    public override equals(ob: unknown): boolean {
        if (this === ob) {
            return true;
        }

        if (!(ob instanceof Charset)) {
            return false;
        }

        return this.#canonicalName === ob.#canonicalName;
    }

    /**
     * Computes a hash code for this charset.
     *
     * @returns A hash code value for this charset
     */
    public override hashCode(): number {
        return MurmurHash.hashCode(this.#canonicalName);
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
     * Returns this charset's canonical name.
     *
     * @returns  The canonical name of this charset
     */
    public name(): JavaString {
        return new JavaString(this.#canonicalName);
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

    /**
     * @returns a string describing this charset.
     */
    public override toString(): JavaString {
        return new JavaString(`Charset[${this.#canonicalName}]`);
    }

    static {
        setTimeout(() => {
            // @ts-expect-error
            Charset.defaultCharset = new Charset("utf-8");
        }, 0);
    }

}
