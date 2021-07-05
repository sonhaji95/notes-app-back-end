const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {
    constructor() {
        this._pool = new Pool();
    }
    //fungsi menambahkan user
    async addUser({ username, password, fullname }) {
        // TODO: VErivikasi username, pastikan belum terdaftar
        await this.verifyNewUsername(username);

        const id = `user-${nanoid(16)}`;//previx-user agar tidak bias dengan id notes
        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new InvariantError('User gagal ditambahkan');
        }
        return result.rows[0].id;

        // TODO: Bila verivikasi lolos, maka masukan user baru ke database


    }

    //function verivikasi username baru ke database
    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };
        
        const result = await this._pool.query(query);

        if (result.rowCount > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
        };
    }

    //function getUser by Id
    async getUserById(userId) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('User tidak ditemukan');
        }
        return result.rows[0];

    } 

}

module.exports = UsersService;