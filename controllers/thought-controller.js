const {Thought, User} = require('../models');

const ThoughtController = {
    // get all Thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .select('-__v')
        .then(thoughtDB => res.json(thoughtDB))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });     
    },

    getThoughtById({params}, res) {
        Thought.findOne({_id: params.id})
            .select('-__v')
        .then(thoughtDB => {
            // 404 if no Thought found
            if(!thoughtDB){
                res.status(404).json({message: 'No Thought found with this ID'});
                return;
            }
            res.json(thoughtDB)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // createThought
    createThought({params, body}, res) {
        console.log(params);
        Thought.create(body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                {_id: body.userId},
                {$push: {thoughts: _id}},
                {new: true}
            )
        })
        .then(userDB => {
            // 404 if no user found
            if(!userDB){
                res.status(404).json({message: 'No user found with this ID'});
                return;
            }
            res.json(userDB)
        })
        .catch(err => res.status(400).json(err));
    },

    // add reaction to Thought
    addReaction({params, body}, res){
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: { reactions: body}},
            { new: true, runValidators: true}
        )
        .then(thoughtDB => {
            if(!thoughtDB) {
                res.status(404).json({message: 'no thought found with this id'});
                return
            }
            res.json(thoughtDB)
        })
        .catch(err => res.json(err))
    },

    // update Thought by id
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true})
            .then(thoughtDB => {
                if(!thoughtDB){
                    res.status(404).json({message: 'No Thought found with this id'})
                    return;
                }
                res.json(thoughtDB);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete Thought
    deleteThought({ params }, res) {
        console.log(params)
        Thought.findOneAndDelete({_id: params.id})
            .then(thoughtDB => {
                if(!thoughtDB){
                    res.status(404).json({ message: 'No Thought found with this id'});
                    return;
                }
        console.log(thoughtDB)

                res.json(thoughtDB);
            })
            .catch(err => res.status(400).json(err));
    },
    
    // remove reaction
    removeReaction({ params, body }, res) {
        console.log(params)
        console.log(body.reactionId)
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true }
        )
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.json(err));
  }
};


module.exports = ThoughtController;