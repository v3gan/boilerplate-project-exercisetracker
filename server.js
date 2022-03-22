const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'))
app.use('/api/users', userRouter);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
