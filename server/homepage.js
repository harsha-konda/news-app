
var homepage=function hompage(req,res){

	request('http://localhost:5000/listTrendingTopics', function (error, response, body) {
		  console.log('body:', body); // Print the HTML for the Google homepage.
	});
	res.json({message:"bitch please!"})
}

module.exports=homepage
