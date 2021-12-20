const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    console.log(email,' ', name,' ', password);
    if(!email || !name || !password) {
        console.log('incorrect form submission');
        return res.status(400).json('incorrect form submission');
    }
    console.log('runs bcrypt');
    const hash = bcrypt.hashSync(password);
    console.log('password ', password);
    db.transaction(trx => {
        console.log('start trx transaction');
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            console.log('loginEmail ', loginEmail);
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                console.log('user ', user);
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        res.status(400).json('unable to register');
    })
}

module.exports = {
    handleRegister: handleRegister
}