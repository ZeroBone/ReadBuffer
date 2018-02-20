"use strict";

const Long = require("./Long");

class ReadBuffer {

    /**
     * ReadBuffer constructor.
     * @param obj {Object} settings.
     */
    constructor(obj) {

        this._buffer = obj.buffer;

        this._offset = obj.offset;

        // this._incrementAmount = obj.incrementAmount || null;

    }

    /**
     * Makes sure the given amount of bytes can possibly be read.
     * @param bytes {Number} the amount of bytes to check.
     * @private
     */
    _requestRead(bytes) {

        if (this._offset + bytes > this._buffer.length) {

            throw new RangeError("Truncated (not enough data).");

        }

    }

    // read methods

    /**
     * Reads unsigned 32 bit integer in big endian.
     * @returns {Number} the read number.
     */
    readUIntBE() {

        this._requestRead(4);

        const value = this._buffer.readUInt32BE(this._offset, true);

        this._offset += 4;

        return value;

    }

    /**
     * Reads unsigned 32 bit integer in big endian.
     * @returns {Number} the read number.
     */
    readIntBE() {

        this._requestRead(4);

        const value = this._buffer.readInt32BE(this._offset, true);

        this._offset += 4;

        return value;

    }

    /**
     * Reads a UTF8 encoded string.
     * @returns {String} the read string.
     */
    readUTF8String() {

        // this length is not always equal with the amount of symbols
        // one UTF8 character can take up to 4 bytes.
        const stringLength = this.readUIntBE(); // the byte amount

        this._requestRead(stringLength);

        const value = this._buffer.toString("utf8", this._offset, this._offset + stringLength);

        this._offset += stringLength;

        return value;

    }

    /**
     * Reads a signed byte fromBuffer the buffer.
     * @returns {Number} read byte.
     */
    readByte() {

        this._requestRead(1);

        // const value = this._buffer[this._offset];
        const value = this._buffer.readInt8(this._offset);

        this._offset++;

        return value;

    }

    /**
     * Reads an unsigned byte fromBuffer the buffer.
     * @returns {Number} read byte.
     */
    readUByte() {

        this._requestRead(1);

        const value = this._buffer.readUInt8(this._offset);

        this._offset++;

        return value;

    }

    /**
     * Reads a byte-encoded binary boolean.
     * @returns {Boolean}
     */
    readBoolean() {

        return !!this.readUByte();

    }

    /**
     * Reads 16 bit signed integer. Also known as short.
     * @returns {Number} the short value.
     */
    readShortBE() {

        this._requestRead(2);

        const value = this._buffer.readInt16BE(this._offset, true);

        this._offset += 2;

        return value;

    }

    /**
     * Reads 16 bit unsigned integer. Also known as short.
     * @returns {Number} the short value.
     */
    readUShortBE() {

        this._requestRead(2);

        const value = this._buffer.readUInt16BE(this._offset, true);

        this._offset += 2;

        return value;

    }

    /**
     * Reads a 64 bit signed integer.
     * @returns {Long} long class instance.
     */
    readLongBE() {

        const high = this.readIntBE();

        const low = this.readIntBE();

        return new Long(high, low, false);

    }

    /**
     * Reads a 64 bit unsigned integer.
     * @returns {Long} long class instance.
     */
    readULongBE() {

        const high = this.readUIntBE();

        const low = this.readUIntBE();

        return new Long(high, low, true);

    }

    /**
     * Reads a floating point 32 bit number from the buffer.
     * @return {Number}
     */
    readFloatBE() {

        this._requestRead(4);

        const value = this._buffer.readFloatBE(this._offset, true);

        this._offset += 4;

        return value;

    }

    // other

    /**
     * Sets the offset for the reader/writer.
     * @param offset {Number} amount of bytes to skip fromBuffer the beginning.
     */
    setOffset(offset) {

        this._offset = offset;

    }

    /**
     * Returns the current offset of the reader/writer.
     * @returns {Number} the current offset.
     */
    getOffset() {

        return this._offset;

    }

    /**
     * Converts the buffer to hex.
     * @returns {String} the hex string.
     */
    toHex() {

        return this._buffer.toString("hex");

    }

    /**
     * Creates a ReadBuffer from a raw buffer.
     * @param buffer {Buffer} the buffer.
     * @param offset {Number} the offset.
     * @return {ReadBuffer} created instance.
     */
    static fromBuffer(buffer, offset = 0) {

        return new ReadBuffer({
            buffer,
            offset
        });

    }

}

module.exports = ReadBuffer;