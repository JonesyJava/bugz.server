import { dbContext } from '../db/DbContext'
import { BadRequest } from '../utils/Errors'

class BugsService {
  async editBug(id, userId, body) {
    const bug = await dbContext.Bug.findOneAndUpdate({ _id: id, creatorId: userId }, body, { new: true })
    if (!bug) {
      throw new BadRequest('Invalid Id')
    }
    if (bug.closed) {
      throw new BadRequest('Do not dit this closed bug')
    }
    return bug
  }

  async deleteBug(body) {
    return await dbContext.Bug.findOneAndUpdate({ _id: body.id, creatorId: body.creatorId, closed: false }, { closed: true }, { new: true })
  }

  async createBug(body) {
    return await dbContext.Bug.create(body)
  }

  async findAllBugs(query = {}) {
    const bug = await dbContext.Bug.find(query).populate('creator')
    return bug
  }

  async findBugById(id) {
    const bug = await dbContext.Bug.findById(id).populate('creator')
    if (!bug) {
      throw new BadRequest('Invalid Id')
    }
    return bug
  }
}

export const bugsService = new BugsService()
