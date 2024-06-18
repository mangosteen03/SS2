export const renderHomePage = (req, res) => {
    res.render('home', {
        is_logged_in: req.isAuthenticated(),
        name: req.user ? req.user.name : null,
        picture: req.user ? req.user.picture : null
    });
};
