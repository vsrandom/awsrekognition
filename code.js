const exp=require('express')
const app=exp()

const fs =require('fs')

const path= require('path')
const dir = path.join(__dirname,'form')
const multer = require('multer')


var upload=multer({dest:'upload/'})


app.get('/r',(req,res)=>{
     res.sendFile(path.join(dir,'reck.html'))
})

app.get('/u',(req,res)=>{
    res.sendFile(path.join(dir,'s3.html'))
})


app.post('/ups3',upload.single('upfile'),(req,res)=>{
    if(req.file){
        const spawn=require('child_process').spawn
        const pythonProcess_s3=spawn('python3',['./upload/uploads3.py',req.file.filename])
        pythonProcess_s3.stdout.on('data',(data)=>{

            fs.unlink(__dirname+'/upload/'+String(req.file.filename),(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log('file '+String(req.file.filename)+'is deleted sucessfully')
                    res.send('File is uploaded to test2499 bucket with name '+ String(req.file.filename)+'.jpg')
                }
            })
        })
    }
})

app.post('/reckog',upload.single('upfile'),(req,res)=>{
    if(req.file)
    {
        const spawn = require('child_process').spawn
        const pythonProcess = spawn('python3',['./upload/reckognition.py',req.file.filename])
        pythonProcess.stdout.on('data',(data)=>{
            fs.unlink(__dirname+'/upload/'+String(req.file.filename),(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log('file '+String(req.file.filename)+'is deleted sucessfully')

                    fs.unlink(__dirname+'/dixit.jpg',(err)=>{
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log('file dixit.jpg is deleted sucessfully')    
                            res.send('Abhinav Dixit is present with Similarity score '+ String(data))
                        }
                    })
                }
            })
        })
    }
})

app.listen(3000)













/*
Basically in form using action we have specified that we want
form data to post on /upload route and we have also specified using 
app.post('/upload'), that any particular post request on this route
will be taken care and using upload.single it will be uploaded on 
server and on the same '/upload' route we will send a feedback 
"Thankyou file has been uploaded"
*/
