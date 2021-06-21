class NotesHandler {
    constructor (service) {
        this._service = service; //_service sebagai lingkup privat secara konvensi

        //bind member dari fungsi Function.prototype.bind
        /*berfungsi untuk mengikat implementasi function agar tetap memiliki konteks sesuai nilai yang ditetapkan 
        pada argumen yang diberikan pada fungsi bind, agar keyword this tetap bernilai instance */
        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    //fungsi handler create note
    postNoteHandler(request, h) {
        try{
        const { title = 'untitled', body, tags } = request.payload;

       const noteId = this._service.addNote({ title, body, tags});

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
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response;
        }
    }

    //fungsi handler read all notes
    getNotesHandler() {
        const notes = this._service.getNotes();
        return {
            status: 'success',
            data: {
                notes,
            },
        };

    }

    //fungsi handler read note by id
    getNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const note = this._service.getNoteById(id);
            return {
            status: 'success',
            data: {
                note,
            },
          }; 
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
       
    }

    //fungsi handler update note by id
    putNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;
            this._service.editNoteById(id, request.payload);
            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }

    //fungsi handler delete note by id
    deleteNoteByIdHandler(request, h) {
        try {
            const  { id } = request.params;
            this._service.deleteNoteById(id);
            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: 'Catatan gagal dihapus. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = NotesHandler;