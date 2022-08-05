const Sequelize = require('sequelize');
const client  = new Sequelize('postgres://localhost/bookmarker');
const PORT = 3000;
const express = require('express');
const app = express();

const Category = client.define('category',{
    name:{
        type: Sequelize.STRING
    }
})
const Bookmark = client.define('bookmark',{
    
    name:{
        type: Sequelize.STRING
    },
    url:{
        type: Sequelize.STRING
    }           
})

Bookmark.belongsTo(Category);

app.get("/bookmarks",async (req,res,next)=>{
    
    const bookmarks = await Bookmark.findAll({
        include: [Category]
    });
    console.log(bookmarks);
    
    res.send(`
    <html>
    <head></head>
        <body>
            <h1>Bookmarks</h1>
            <ul>
                ${bookmarks.map((elem)=>{
                    return `<li><a href="${elem.url}">${elem.name}</a> - ${elem.category.name}
                    </li>`
                }).join('')}
            </ul>
        </body>
    </html>`);
});

const start = async()=>{

    try{
        await client.sync({force:true});
        const [coding,search,jobs] = await Promise.all([
            Category.create({name:'coding'}),
            Category.create({name:'search'}),
            Category.create({name:'jobs'})
        ]);
        
        await Promise.all([
            Bookmark.create({name:'google',url:'https://www.google.com/',categoryId:search.id}),
            Bookmark.create({name:'stack overflow',url:'https://stackoverflow.com/',categoryId:coding.id}),
            Bookmark.create({name:'Bing',url:'https://www.bing.com/',categoryId:search.id}),
            Bookmark.create({name:'Linkedin',url:'https://www.linkedin.com/',categoryId:jobs.id}),
            Bookmark.create({name:'Indeed',url:'https://www.indeed.com/',categoryId:jobs.id}),
            Bookmark.create({name:'MDN',url:'https://developer.mozilla.org/en-US/',categoryId:coding.id})
        ]);

        app.listen(PORT,()=>{
            console.log(`Listening on port ${PORT}`);
        })

    }
    catch(error){
        console.log(error);
    }

}

start();