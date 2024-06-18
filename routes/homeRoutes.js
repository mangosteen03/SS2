import express from 'express';
import { renderHomePage } from '../controllers/homeController.js';
import { isAuthenticated, logout } from '../controllers/authController.js';
import { completeTextHandle, getActivities, grammarCheck, paraphraseText,checkPlagiarism } from '../controllers/activityController.js';
import passport from 'passport';

const router = express.Router();

router.get('/', renderHomePage);
router.get('/user-activities', isAuthenticated, getActivities);
router.post('/grammar-check', isAuthenticated, grammarCheck);
router.post('/paraphrasing', isAuthenticated, paraphraseText);
router.post('/text-completion', isAuthenticated, completeTextHandle);
router.post('/plagiarism', isAuthenticated, checkPlagiarism);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/grammar-check');
    });

router.get('/grammar-check', isAuthenticated, (req, res) => {
    const { name, picture } = req.user;
    res.render('grammar_check', { is_logged_in: true, name, picture });
});

router.get('/paraphrasing', isAuthenticated, (req, res) => {
    const { name, picture } = req.user;
    res.render('paraphrasing', { is_logged_in: true, name, picture });
});



router.get('/text-completion', isAuthenticated, (req, res) => {
    const { name, picture } = req.user;
    res.render('text_completion', { is_logged_in: true, name, picture });
});

router.get('/plagiarism', isAuthenticated, (req, res) => {
    const { name, picture } = req.user;
    res.render('plagiarism_check', { is_logged_in: true, name, picture });
})
router.get('/logout', logout);

export default router;
