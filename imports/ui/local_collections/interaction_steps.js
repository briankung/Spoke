export const InteractionStepCollection = new Mongo.Collection(null)

const getParent = (step) => {
  return InteractionStepCollection.findOne({ 'allowedAnswers.interactionStepId': step._id})
}

export const getAllParents = (step) => {
  let parents = []
  let answer
  while (step) {
    let parent = getParent(step)

    if (parent) {
        answer = parent.allowedAnswers.find((answer) => answer.interactionStepId === step._id)
        parents = [parent, answer].concat(parents)
    }

    step = parent

  }

  return parents
}