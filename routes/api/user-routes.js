const router = require('express').Router();
const{
    getAllUsers,
    getUserById,
    createUser,
    addFriend,
    updateUser,
    deleteUser,
    removeFriend
} = require('../../controllers/user-controller')

// /api/users
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router 
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router 
    .route('/:id/friends/:friendId')
    .post(addFriend)
    .delete(deleteUser);

module.exports = router;
