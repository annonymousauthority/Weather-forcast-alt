
const getAccount = async (req, res, next) => {
    const {Account} = req.app.get('models')
    const account = await Profile.findOne({where: {id: req.app('account_id') || 0}})
    if(!account) return res.send('Invalid account: account not found')
    req.account = account
    next()
}

module.exports = {getAccount}