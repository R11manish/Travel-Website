
exports.getOverview = (req, res) => {
    res.status(200).render('overview', {
        title: 'All tour'
    })
}



exports.tour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    })
}