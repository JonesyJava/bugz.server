import { dbContext } from '../db/DbContext'
import { BadRequest } from '../utils/Errors'

class NotesService {
  async deleteNote(id) {
    const note = await dbContext.Note.findByIdAndDelete(id)
    if (!note) {
      throw new BadRequest('Invalid Id')
    }
    return 'Note has been DELETED succesfully'
  }

  async editNote(id, body) {
    const note = await dbContext.Note.findOneAndUpdate(id, body, { new: true })
    if (!note) {
      throw new BadRequest('Invalid Id')
    }
    return note
  }

  async createNote(body) {
    return await dbContext.Note.create(body)
  }

  async findAllNotes(query) {
    return await dbContext.Note.find(query)
  }

  async findNoteByBugId(id) {
    const note = await dbContext.Note.findById(id).populate('creator')
    if (!note) {
      throw new BadRequest('Invalid Id')
    }
    return note
  }
}

export const notesService = new NotesService()
