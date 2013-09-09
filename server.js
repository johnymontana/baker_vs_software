"use strict"

// TODO: filter out y=0 observations
// TODO: move to heroku
// TODO: db migration to mongo[lab,HQ]
// TODO: some way to highlight baker/compProg on viz #4, possibly new visual with only baker/compProg

var addRegression = function(series) {
  // s_x = sum(x_i)
  // s_xx = sum(x_i^2)
  // s_y = sum(y_i)
  // s_xy = sum(x_i*y_i)
  // s_yy = sum(y_i^2)

  // m = (n*s_xy - s_x*s_y) / (n*s_xx-s_x^2)
  // b = (1/n)*s_y - m*(1/n)*s_x

  var x = [];
  var y = [];
  //var s_x,
  //  s_xx,
  //  s_y,
  //  s_xy,
  //  s_yy;
  var num_series = series.length;
  for (var i = 0; i<num_series; i++) {
    var obj = series[i];
    // obj.name, obj.data, obj.color, obj.renderer
    var x = [];   
    var y = [];
    var s_x = 0;
    var s_y = 0;
    var s_xx = 0;
    var s_yy = 0;
    var s_xy = 0;
    //var sum_x = 0;
    //var sum_y = 0;
    for (var j = 0; j<obj.data.length; j++) {
      x.push(obj.data[j].x);
      y.push(obj.data[j].y);
      s_x += obj.data[j].x;
      s_y += obj.data[j].y;
      s_xy += obj.data[j].x * obj.data[j].y;
      s_xx += obj.data[j].x * obj.data[j].x;
      s_yy += obj.data[j].y * obj.data[j].y;
    }

    var m = (x.length * s_xy - s_x * s_y) / (x.length * s_xx - (s_x*s_x));
    var b = (1 / x.length) * s_y - m * (1/ x.length) * s_x;

    var obj2 = {};
    obj2.name = obj.name + " regression";
    obj2.color = obj.color;
    obj2.data = [];
    obj2.renderer = 'line';
    // TODO: set renderer = 'line'
    for (var k=0; k < x.length; k++) {
      obj2.data.push({x: x[k], y: (m*x[k] + b)}); 
    }
    
    series.push(obj2);
    // do calcs
    // create new obj2:
    //	obj2.name = obj.name + " regression"
    //	obj2.renderer = 'line'
    //	obj2.color = obj.color
    //	obj2.data = loop( obj2.data.y_i = m*x_i+b, obj2.data.x_i = obj.data.x_i
    //	series.push(obj2) 
  }
  console.log("addRegression: " + JSON.stringify(series));
  return series;
}

var CPI12 = {1990: 0.571, 1991:0.595, 1992: 0.613, 1993: 0.631, 1994: 0.648, 1995: 0.666, 1996: 0.686, 1997: 0.701, 1998: 0.712, 1999: 0.728, 2000: 0.752, 2001: 0.774, 2002: 0.786, 2003: 0.804, 2004: 0.825, 2005: 0.853, 2006: 0.881, 2007: 0.906, 2008: 0.941, 2009: 0.937, 2010: 0.953, 2011: 0.983, 2012: 1.00};

var express = require('express'),
  hbs = require('hbs'),
  fs = require('fs'),
  //sift = require('sift'),
  //MongoClient = require('mongodb').MongoClient,
  //Server = require('mongodb').Server,
  //async = require('async'),
  openingsData = addRegression(require('./openings')),
  combinedData = require('./combined'),
  salaryData = require('./salary'),
  industryData = require('./industry'),
  db;

//var connectDB = function(callback) {
//  var mongoClient = new MongoClient(new Server('localhost', 27017));
//  mongoClient.open(function(err, mongoClient) {
//    if(err) {
//      console.log("database connection error: " + err);
//      callback(err);
//    }
//
//    else {
//      db = mongoClient.db("CSCI_441_Proj1_DB");
//      console.log("data connection established");
//      callback(null);
//    }
//  });
//}


var port = process.env.PORT || 5000;


// init express app, hbs templating engine and static dir
var app = express();
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//the data



//var fetchGrowthDiff = function(ind_id, callback) {
//  
  //fetch year 2001 for ind_id: fetch year 2012: return (2012-2001)/2001
//  db.collection("cew").find({industry_code: ind_id, year: 2001}).toArray(function(err, doc_2001) {
//    if (err) {
//      console.log("error on db fetch: " + err);
//      callback(err);
//    }
//
//    else {
//      db.collection("cew").find({industry_code: ind_id, year: 2012}).toArray(function( err, doc_2012) {
//	if (err) {
//	  console.log("error on db fetch: " + err);
//	  callback(err);
//	}
//
//	else {
	  // var obj = {name: doc_2001.industry_title, data: [{x: (2012-2001)/2001 y: (2012-2001)/2001}] }: callback(null, obj);
	  
//	  doc_2001 = doc_2001[0];
//	  doc_2012 = doc_2012[0];
//
//	  if (doc_2001 && doc_2012) {
//	    var wage2001 = doc_2001.avg_annual_pay / CPI12[2001];
//	    var obj = {
//	      name: doc_2001.industry_title,
//	      renderer: "scatterplot",
//	      data: [{ 
//		    x: (doc_2012.annual_avg_emplvl-doc_2001.annual_avg_emplvl)/doc_2001.annual_avg_emplvl,
		    //y: (doc_2012.avg_annual_pay-doc_2001.avg_annual_pay)/doc_2001.avg_annual_pay
//		    y: (doc_2012.avg_annual_pay - wage2001) / wage2001
//		    }]
//
//	    };
//
//	    callback(null, obj);
//	  }
//	  else {
//	    callback(null, null);
//	  }
//
//	}
//
//
  //    });
//
//
 //  }
//
//  });

//}

/*

var fetchSalaryAndGrowthData = function(callback) {

  db.collection("cew").distinct('industry_code', function(err, ind_ids){
    if(err) {
      console.log("err on db fetch: " + err);
      callback(err);
    }

    else {

      console.log(ind_ids);

      async.map(ind_ids, fetchGrowthDiff, function(err, results) {
	//console.log(JSON.stringify(results)); // results is all growthDiff data -> could do growth and salary delta at same time???
	callback(null, results);
      });

    }


  });


}

*/

/*
var fetchGrowthData =  function(industry_code_1, industry_code_2, callback) {
  var compProg = [];
  var baking = [];
  var series = [];
  var data_1;
  var data_2;

  db.collection("cew").find({industry_code: industry_code_1}).toArray( function(err, docs) {
  if(err) {
    console.log("err on DB fetch: " + err);
    callback(err);
  }

  else {
    console.log(docs);
    for (var i=0; i<docs.length; i++) {
      compProg.push({x: (new Date(docs[i].year.toString()).valueOf()) / 1000, y: docs[i].annual_avg_estabs_count});
    }

    series.push({"name": docs[0].industry_title, "data": compProg, "color": "steelblue", renderer: "scatterplot" });
    //console.log(series);
    //callback(null, series);
    db.collection("cew").find({industry_code: industry_code_2}).toArray( function(err, docs) {
      if(err) {
	console.log("err on DB fetch: " + err);
	callback(err);
      }

      else {
	console.log(docs);
	for (var j=0; j<docs.length; j++) {
	  baking.push({x: (new Date(docs[j].year.toString()).valueOf()) / 1000, y: docs[j].annual_avg_estabs_count});
	}

	series.push({"name": docs[0].industry_title, "data": baking, "color": "red", renderer: "scatterplot"});
	//console.log(series);
	callback(null, series);
      }
    
    });
 
  }

  });
}

*/

/*
var fetchScatterData = function(industry_code_1, industry_code_2, callback) {
  var compProg = [];
  var baking = [];
  var series = [];
  var data_1;
  var data_2;

  db.collection("cew").find({industry_code: industry_code_1}).toArray( function(err, docs) {
  if(err) {
    console.log("err on DB fetch: " + err);
    callback(err);
  }

  else {
    console.log(docs);
    for (var i=0; i<docs.length; i++) {
      compProg.push({x: (new Date(docs[i].year.toString()).valueOf()) / 1000, y: (docs[i].avg_annual_pay / CPI12[docs[i].year])} );
    }

    series.push({"name": docs[0].industry_title, "data": compProg, "color": "steelblue", renderer: "scatterplot" });
    //console.log(series);
    //callback(null, series);
    db.collection("cew").find({industry_code: industry_code_2}).toArray( function(err, docs) {
      if(err) {
	console.log("err on DB fetch: " + err);
	callback(err);
      }

      else {
	console.log(docs);
	for (var j=0; j<docs.length; j++) {
	  if (docs[j].avg_annual_pay > 0 ) {
	    baking.push({x: (new Date(docs[j].year.toString()).valueOf()) / 1000, y: (docs[j].avg_annual_pay / CPI12[docs[j].year])});
	  }
	}

	series.push({"name": docs[0].industry_title, "data": baking, "color": "red", renderer: "scatterplot"});
	//console.log(series);
	callback(null, series);
      }
    
    });
 
  }

  });
}
*/

//var inflationAdjusted = function ()


//hbs helpers
hbs.registerHelper('insert_obj', function(obj) {
  return new hbs.SafeString(JSON.stringify(obj));
});

//BEGIN routes


app.get('/salary', function(req, res) {
  res.render('scatter_template', {seriesData: salaryData});

});

//app.get('/scatter/:ind1_id/:ind2_id', function(req, res) {
//
//
//  fetchScatterData(Number(req.params.ind1_id), Number(req.params.ind2_id), function(err, datas) {
//
//  if (err) {
//    console.log("error on fetchScatterData: " + err);
    // EXIT??
//  }
//  else {
//    res.render('scatter_template', {seriesData: addRegression(datas)});
//  }
//  });
//});

app.get('/combined_growth', function(req, res) {
  res.render('combined_template', {seriesData: combinedData});

});

//app.get('/combined_growth', function(req, res) {
//  fetchSalaryAndGrowthData(function(err, combined_raw_data) {
//    //console.log(combined_raw_data);
//    var seriesData = [];
//    for (var i=0; i<combined_raw_data.length; i++) {
//      if (combined_raw_data[i] && combined_raw_data[i].data[0].x && combined_raw_data[i].data[0].y && !(isNaN(combined_raw_data[i].data[0].x)) && !(isNaN(combined_raw_data[i].data[0].y)) && (typeof combined_raw_data[i].data[0].x == 'number') && (typeof combined_raw_data[i].data[0].y == 'number') && (combined_raw_data[i].data[0].x != Infinity) && (combined_raw_data[i].data[0].y != Infinity) && combined_raw_data[i].data[0].x < 8 ) {
//	seriesData.push(combined_raw_data[i]);
//      }
//
//    }
//    console.log(JSON.stringify(seriesData));
//    res.render('combined_template', {seriesData: seriesData });
//  });
//});


app.get('/industry', function(req, res) {
  res.render('growth_template', {seriesData: industryData});

});

//app.get('/growth/:ind1_id/:ind2_id', function(req, res) {
//
//
//  fetchGrowthData(Number(req.params.ind1_id), Number(req.params.ind2_id), function(err, datas) {
//
//  if (err) {
//    console.log("error on fetchScatterData: " + err);
    // EXIT??
//  }
//  else {
//    res.render('growth_template', {seriesData: addRegression(datas)});
//  }
//  });
//});

app.get('/', function(req, res) {

  res.render('index_template', {});
});

app.get('/openings', function(req, res) {
  res.render('openings_template', {seriesData: openingsData});
});




var listen = function(callback) {
  app.listen(port, function() {
    console.log("Listening on " + port);
  });
}

listen();

//async.series([connectDB, listen]);
