import BaseController from '../utils/BaseController'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { bugsService } from '../services/BugsService'
import { notesService } from '../services/NotesService'

export class BugsController extends BaseController {
  constructor() {
    super('api/bugs')
    this.router
      .get('', this.getAllBugs)
      .get('/:id/notes', this.getAllNotes)
      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('/:id', this.getBugsById)
      .post('', this.createBug)
      .put('/:id', this.editBug)
      .delete('/:id', this.deleteBug)
  }

  async getAllNotes(req, res, next) {
    try {
      res.send(await notesService.findAllNotes({ bugId: req.params.id }))
    } catch (error) {
      next(error)
    }
  }

  async deleteBug(req, res, next) {
    try {
      const query = {
        id: req.params.id,
        creatorId: req.userInfo.id
      }
      res.send(await bugsService.deleteBug(query))
    } catch (error) {
      next(error)
    }
  }

  async editBug(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      delete req.body.closed
      res.send(await bugsService.editBug(req.params.id, req.userInfo.id, req.body))
    } catch (error) {
      next(error)
    }
  }

  async getBugsById(req, res, next) {
    try {
      return res.send(await bugsService.findBugById(req.params.id))
    } catch (error) {
      next(error)
    }
  }

  async getAllBugs(req, res, next) {
    try {
      return res.send(await bugsService.findAllBugs())
    } catch (error) {
      next(error)
    }
  }

  async createBug(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorId = req.userInfo.id
      const bug = await bugsService.createBug(req.body)
      res.send(await bugsService.findBugById(bug._id))
    } catch (error) {
      next(error)
    }
  }
}
