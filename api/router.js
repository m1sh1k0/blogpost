import { auth, post, editor, admin, comment } from './Controllers/index'
import { Router } from 'express'

const router = new Router()

// Guest
router.get('/', post.list)
router.get('/:slug', post.view)
router.post('/comment/:slug', comment.leave)

//Editor
router.post('/editor/registration', editor.register)
router.post('/editor/login', editor.login)
router.get('/editor/posts', auth, editor.list)
router.get('/editor/post/:slug', auth, editor.view)
router.put('/editor/post/:slug', auth, editor.edit)
router.put('/editor/edit_comment/:id/:bool', auth, editor.manageComment)

//Admin login
router.post('/admin/login', admin.login)

// Admin manage content
router.get('/admin/posts', auth, admin.allPosts)
router.get('/admin/posts/:status', auth, admin.filterList)
router.get('/admin/post/:slug', auth, admin.viewPost)
router.put('/admin/post/:slug', auth, admin.editPost)
router.delete('/admin/post/:slug', auth, admin.deletePost)
router.put('/admin/edit_comment/:id/:bool', auth, admin.manageComment)

// Admin manage editors
router.get('/admin/editors/', auth, admin.listEditors)
router.put('/admin/editor/:id/:confirm', auth, admin.manageEditor)

export default router
