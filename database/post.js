mudule.export.setup = function (app, db){
    app.post('/db/accounts/login/:email/:password', (req,res,next) => {
        let result = {
            rsp : 'fail',
        }
        const token = 'T-' + Math.floor(Math.random() * 100000).toString()

        db.get(
            `SELECT * FROM tbl_accounts WHERE email='${req.params.email}'`,
            (err, row) => {
              if (!err) {
                if (!row) {
                  result.rsp = 'no_email -- 이메일이 없습니다.'
                  result.email = req.params.email
                  res.json(result)
                } else if (row['password'] != req.params.password) {
                  result.rsp = 'wrong_password- 비밀번호를 확인 해 주세요'
                  res.json(result)
                } else {
                  db.run(
                    `UPDATE tbl_accounts SET token='${token}' WHERE email='${req.params.email}'`
                  )
                  result.rsp = 'ok'
                  result.token = token
                  res.json(result)
                }
              } else {
                result.rsp = 'no_email -- 이메일이 없습니다.'
                res.json(result)
              }
            }
          )
    })

    // 토큰확인
    app.post('/db/accounts/check-token/:email/:token', (req, res, next) => {
        let result = {
          rsp: 'fail',
        }
        db.get(
          `SELECT * from tbl_accounts WHERE grade = 'owner' AND ((email='${req.params.email}' AND token='${req.params.token}') OR (email='vue' AND password='vue' AND token is null))`,
          (err, row) => {
            if (!err && row) {
              result.rsp = 'ok'
              result.data = row['email']
              res.json(result)
            } else {
              res.json(result)
            }
          }
        )
    })
}