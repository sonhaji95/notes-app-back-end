const ClientError = require('../../exceptions/ClientError');

class NotesHandler {
    constructor(service, validator) {
        this._service = service; 
        this._validator = validator;

        //bind member dari fungsi Function.prototype.bind
        //berfungsi untuk mengikat implementasi function agar tetap memiliki konteks sesuai nilai yang ditetapkan 
        //pada argumen yang diberikan pada fungsi bind, agar keyword this tetap bernilai instance 
        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    //fungsi handler create note
   async postNoteHandler(request, h) {
        try{
            this._validator.validateNotePayload(request.payload);
        const { title = 'untitled', body, tags } = request.payload;

       const noteId = await this._service.addNote({ title, body, tags});

       const response = h.response({
           status: 'success',
           message: 'Catatan berhasil ditambahkan',
           data: {
               noteId,
           },
       });
       response.code(201);
       return response;
    } catch (error) {
        if (error instanceof ClientError) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });      
        response.code(error.statusCode);
        return response;
        }

        // Server Error
        const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
        }
    }

    //fungsi handler read all notes
    async getNotesHandler() {
        const notes = await this._service.getNotes();
        return {
            status: 'success',
            data: {
                notes,
            },
        };

    }

    //fungsi handler read note by id
    async getNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const note = await this._service.getNoteById(id);
            return {
            status: 'success',
            data: {
                note,
            },
          }; 
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(error.statusCode);
            return response;
            }

            // Server Error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500),
            console.error(error);
            return response;
           
        }
       
    }

    //fungsi handler update note by id
    async putNoteByIdHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);
            const { id } = request.params;
            await this._service.editNoteById(id, request.payload);
            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            };
        } catch (error) {
            if (error instanceof ClientError) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(error.statusCode);
            return response;
        }

        // Server Error
        const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
        }
    }

    //fungsi handler delete note by id
   async deleteNoteByIdHandler(request, h) {
        try {
            const  { id } = request.params;
           await this._service.deleteNoteById(id);
            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            };
        } catch (error) {
            if (error instanceof ClientError) {
            const response = h.response({
                status: 'fail',
                message: 'Catatan gagal dihapus. Id tidak ditemukan',
            });
            response.code(error.statusCode);
            return response;
        }

        // Server Error
        const response =  h.response ({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
        }
    }

}


module.exports = NotesHandler;