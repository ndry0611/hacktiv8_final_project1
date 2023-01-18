const router = require('express').Router();
const UserController = require('../controller/user');
const ReflectionController = require('../controller/reflection');
const authentication = require('../middleware/auth');
const authorization = require('../middleware/authorization');

router.post('/api/v1/users/register', UserController.register);
router.post('/api/v1/users/login', UserController.login);
router.use(authentication);
router.get('/api/v1/reflections', ReflectionController.getReflections);
router.post('/api/v1/reflections', ReflectionController.createReflection);
router.put('/api/v1/reflections/:reflectionId', authorization ,ReflectionController.updateReflections);
router.delete('/api/v1/reflections/:reflectionId', authorization ,ReflectionController.deleteReflection);

module.exports = router;