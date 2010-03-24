// Specs for couch.js lines 313-470

describe 'CouchDB class'
  describe 'session stuff'
    before_each
      users_db = new CouchDB("_users", {"X-Couch-Full-Commit":"false"});
      users_db.createDb();
      userDoc = users_db.save(CouchDB.prepareUserDoc({name: "Gaius Baltar", roles: ["president"]}, "secretpass"));
    end
  
    after_each
      users_db.deleteDoc({_id : userDoc.id, _rev : userDoc.rev})
      users_db.deleteDb();
    end
    
    describe '.login'
      it 'should return ok true'
        CouchDB.login("Gaius Baltar", "secretpass").ok.should.be_true
      end
    
      it 'should return the name of the logged in user'
        CouchDB.login("Gaius Baltar", "secretpass").name.should.eql "Gaius Baltar"
      end
    
      it 'should post _session'
        CouchDB.should.receive("request", "once").with_args("POST", "/_session")
        CouchDB.login("Gaius Baltar", "secretpass");
      end
      
      it 'should create a session'
        CouchDB.login("Gaius Baltar", "secretpass");
        CouchDB.session().userCtx.name.should.eql "Gaius Baltar"
      end
    end
    
    describe '.logout'
      before_each
        CouchDB.login("Gaius Baltar", "secretpass");
      end
    
      it 'should return ok true'
        CouchDB.logout().ok.should.be_true
      end
    
      it 'should delete _session'
        CouchDB.should.receive("request", "once").with_args("DELETE", "/_session")
        CouchDB.logout();
      end
      
      it 'should result in an invalid session'
        CouchDB.logout();
        CouchDB.session().name.should.be_null
      end
    end
  
    describe '.session'
      before_each
        CouchDB.login("Gaius Baltar", "secretpass");
      end
  
      it 'should return ok true'
        CouchDB.session().ok.should.be_true
      end
      
      it 'should return the users name'
        CouchDB.session().userCtx.name.should.eql "Gaius Baltar"
      end
      
      it 'should return the users roles'
        CouchDB.session().userCtx.roles.should.eql ["president"]
      end
      
      it 'should return the name of the authentication db'
        CouchDB.session().info.authentication_db.should.eql "_users"
      end
      
      it 'should return the active authentication handler'
        CouchDB.session().info.authenticated.should.eql "cookie"
      end
    end
  end
  
  describe 'db stuff'
    before_each
      db = new CouchDB("spec_db", {"X-Couch-Full-Commit":"false"});
      db.createDb();
      userDoc = CouchDB.prepareUserDoc({name: "Laura Roslin"}, "secretpass");
    end
  
    after_each
      db.deleteDb();
    end
  
    describe '.prepareUserDoc'
      it 'should return the users name'
        userDoc.name.should.eql "Laura Roslin"
      end
      
      it 'should prefix the id with the CouchDB user_prefix'
        userDoc._id.should.eql "org.couchdb.user:Laura Roslin"
      end
      
      it 'should return the users roles'
        var userDocWithRoles = CouchDB.prepareUserDoc({name: "William Adama", roles: ["admiral", "commander"]}, "secretpass")
        userDocWithRoles.roles.should.eql ["admiral", "commander"]
      end
      
      it 'should return the hashed password'
        userDoc.password_sha.length.should.be_at_least 30
        userDoc.password_sha.should.be_a String
      end
    end
      
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
      it 'should return the total number of documents'
        CouchDB.allDesignDocs().spec_db.total_rows.should.eql 0
        db.save({'type':'battlestar', 'name':'galactica'});
        CouchDB.allDesignDocs().spec_db.total_rows.should.eql 1
      end
      
      it 'should return undefined when the db does not exist'
        CouchDB.allDesignDocs().non_existing_db.should.be_undefined
      end
      
      it 'should return no documents when there are no design documents'
        CouchDB.allDesignDocs().spec_db.rows.should.eql []
      end
      
      it 'should return all design documents'
        var designDoc = {
          "views" : {
            "people" : {
              "map" : "function(doc) { emit(doc._id, doc); }"
            }
          },
          "_id" : "_design/spec_db"
        };
        db.save(designDoc);
        CouchDB.allDesignDocs().spec_db.rows[0].id.should.eql "_design/spec_db"
        CouchDB.allDesignDocs().spec_db.rows[0].key.should.eql "_design/spec_db"
        CouchDB.allDesignDocs().spec_db.rows[0].value.rev.length.should.be_at_least 30
      end
    end
    
    describe '.getVersion'
      it 'should get the CouchDB version'
        CouchDB.should.receive("request", "once").with_args("GET", "/")
        CouchDB.getVersion();
      end
      
      it 'should return the CouchDB version'
        CouchDB.getVersion().should_match /^\d\d?\.\d\d?\.\d\d?.*/
      end
    end
    
    describe '.replicate'
      before_each
        db2 = new CouchDB("spec_db_2", {"X-Couch-Full-Commit":"false"});
        db2.createDb();
        host = window.location.protocol + "//" + window.location.host ;
      end
      
      after_each
        db2.deleteDb();
      end
      
      it 'should return no_changes true when there are no changes between the dbs'
        CouchDB.replicate(host + db.uri, host + db2.uri).no_changes.should.be_true
      end
      
      it 'should return the session ID'
        db.save({'type':'battlestar', 'name':'galactica'});
        CouchDB.replicate(host + db.uri, host + db2.uri).session_id.length.should.be_at_least 30
      end
      
      it 'should return source_last_seq'
        db.save({'type':'battlestar', 'name':'galactica'});
        db.save({'type':'battlestar', 'name':'pegasus'});
        
        CouchDB.replicate(host + db.uri, host + db2.uri).source_last_seq.should.eql 2        
      end
      
      it 'should return the replication history'
        db.save({'type':'battlestar', 'name':'galactica'});
        db.save({'type':'battlestar', 'name':'pegasus'});
        
        var result = CouchDB.replicate(host + db.uri, host + db2.uri);
        result.history[0].docs_written.should.eql 2        
        result.history[0].start_last_seq.should.eql 0        
      end
      
      it 'should pass through replication options'
        db.save({'type':'battlestar', 'name':'galactica'});
        db2.deleteDb();
        -{CouchDB.replicate(host + db.uri, host + db2.uri)}.should.throw_error
        var result = CouchDB.replicate(host + db.uri, host + db2.uri, {"body" : {"create_target":true}});
    
        result.ok.should.eql true
        result.history[0].docs_written.should.eql 1   
        db2.info().db_name.should.eql "spec_db_2"
      end
    end
    
    describe '.newXhr'
      it 'should return a XMLHTTPRequest'
        CouchDB.newXhr().should.have_prop 'readyState'
        CouchDB.newXhr().should.have_prop 'responseText'
        CouchDB.newXhr().should.have_prop 'status'
      end
    end
    
    describe '.request'
    
    end
  
    describe '.requestStats'
    
    end
    
    describe '.newUuids'
    
    end
    
    describe '.maybeThrowError'
      it 'should throw an error when the request has status 404'
        var req = CouchDB.request("GET", "/nonexisting_db");
        -{CouchDB.maybeThrowError(req)}.should.throw_error 
      end
    
      it 'should throw an error when the request has status 412'
        var req = CouchDB.request("PUT", "/spec_db");
        -{CouchDB.maybeThrowError(req)}.should.throw_error
      end
    
      it 'should throw an error when the request has status 405'
        var req = CouchDB.request("DELETE", "/_utils");
        -{CouchDB.maybeThrowError(req)}.should.throw_error
      end
    
      it 'should throw the responseText of the request'
        var req = CouchDB.request("GET", "/nonexisting_db");
        try {
          CouchDB.maybeThrowError(req)
        } catch(e) {
          e.error.should.eql JSON.parse(req.responseText).error
          e.reason.should.eql JSON.parse(req.responseText).reason
        }
      end
    
      it 'should throw an unknown error when the responseText is invalid json'
        mock_request().and_return("invalid json...", "application/json", 404, {})
        try {
          CouchDB.maybeThrowError(CouchDB.newXhr())
        } catch(e) {
          e.error.should.eql "unknown"
          e.reason.should.eql "invalid json..."
        }
      end
    end
    
    describe '.params'
      it 'should turn a json object into a http params string'
        var params = CouchDB.params({"president":"laura", "cag":"lee"})
        params.should.eql "president=laura&cag=lee"
      end
    
      it 'should return a blank string when the object is empty'
        var params = CouchDB.params({})
        params.should.eql ""
      end
    end
  end
end