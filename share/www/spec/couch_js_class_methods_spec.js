// Specs for couch.js lines 313-470

describe 'CouchDB class'
  before_each
    db = new CouchDB("spec_db", {"X-Couch-Full-Commit":"false"});
    db.createDb();
  end
  
  after_each
    db.deleteDb();
  end
  
  // describe '.login'
  //   it 'should create a session'
  //     var userDoc = CouchDB.prepareUserDoc({name: "gaius", roles: "president"}, "secretpass");
  //     var result = db.save(userDoc);
  //     console.log(result)
  //     
  //     // db.setSecObj({"admins":{"names":["gaius"],"roles":["president"]}})
  //     // console.log(db.getSecObj());
  //     
  //     var saved_user = db.open(result.id);
  //     console.log(saved_user)
  //    
  //     // console.log(CouchDB.login("org.couchdb.user:gaius", "secretpass"));
  //     console.log(CouchDB.login("gaius", "secretpass"));
  //   end
  // end

  describe '.logout'
    
  end

  describe '.session'
    
  end

  // describe '.prepareUserDoc'
  //   it 'should prepare the user doc'
  //     console.log(CouchDB.prepareUserDoc({'name':'apollo'}, 'secret'))
  //     console.log(CouchDB.login('apollo', 'secret'))
  //   end
  // end

  describe '.allDbs'
    it 'should get _all_dbs'
      CouchDB.should.receive("request", "once").with_args("GET", "/_all_dbs");
      CouchDB.allDbs();
    end
    
    it 'should return an array that includes a created database'
      temp_db = new CouchDB("temp_spec_db", {"X-Couch-Full-Commit":"false"});
      temp_db.createDb();
      CouchDB.allDbs().should.include("temp_spec_db");
      temp_db.deleteDb();
    end
    
    it 'should return an array that does not include a database that does not exist'
      CouchDB.allDbs().should.not.include("not_existing_temp_spec_db");
    end
  end
  
  describe '.allDesignDocs'
    
  end
  
  describe '.getVersion'
    
  end
  
  describe '.replicate'
    
  end

  describe '.newXhr'
    
  end

  describe '.request'
    
  end

  describe '.requestStats'
    
  end
  
  describe '.newUuids'
    
  end

  // describe '.maybeThrowError'
  //   it 'should throw an error when the request has status 404'
  //     var req = CouchDB.request("GET", "/nonexisting_db");
  //     -{CouchDB.maybeThrowError(req)}.should.throw_error 
  //   end
  // 
  //   it 'should throw an error when the request has status 412'
  //     var req = CouchDB.request("PUT", "/spec_db");
  //     -{CouchDB.maybeThrowError(req)}.should.throw_error
  //   end
  // 
  //   it 'should throw an error when the request has status 405'
  //     var req = CouchDB.request("DELETE", "/_utils");
  //     -{CouchDB.maybeThrowError(req)}.should.throw_error
  //   end
  // 
  //   it 'should throw the responseText of the request'
  //     var req = CouchDB.request("GET", "/nonexisting_db");
  //     try {
  //       CouchDB.maybeThrowError(req)
  //     } catch(e) {
  //       e.error.should.eql JSON.parse(req.responseText).error
  //       e.reason.should.eql JSON.parse(req.responseText).reason
  //     }
  //   end
  // 
  //   it 'should throw an unknown error when the responseText is invalid json'
  //     mock_request().and_return("invalid json...", "application/json", 404, {})
  //     try {
  //       CouchDB.maybeThrowError(CouchDB.newXhr())
  //     } catch(e) {
  //       e.error.should.eql "unknown"
  //       e.reason.should.eql "invalid json..."
  //     }
  //   end
  // end
  // 
  // describe '.params'
  //   it 'should turn a json object into a http params string'
  //     var params = CouchDB.params({"president":"laura", "cag":"lee"})
  //     params.should.eql "president=laura&cag=lee"
  //   end
  // 
  //   it 'should return a blank string when the object is empty'
  //     var params = CouchDB.params({})
  //     params.should.eql ""
  //   end
  // end  
end