// Specs for jquery_couch.js lines 48-156 and 415-448

describe 'jQuery couchdb'
  before
    if(typeof(old_alert) == 'undefined'){
      old_alert = alert;
    }
    alert = function(msg){
      // console.log('alert: ', msg)
    };
  end
  
  after
    alert = old_alert;
  end
  
  describe 'activeTasks'
    before_each
      db = $.couch.db("spec_db");
      db.create();
      db.saveDoc({'type':'battlestar', 'name':'galactica'});
    end
    
    after_each
      db.drop();
    end
    
    it 'should return an empty array when there are no active tasks'
      $.couch.activeTasks({
        success: function(resp){
          resp.should.eql []
        }
      });
    end
    
    it 'should return an active task'
      db.compact({
        ajaxStart: function(resp){
          $.couch.activeTasks({
            success: function(resp2){
              resp2[0].type.should.eql "Database Compaction"
              resp2[0].task.should.eql "spec_db"
              resp2[0].status.should.eql "Starting"
              resp2[0].should.include "pid"
            }
          });
        }
      });
    end
  end
  
  describe 'allDbs'
    it 'should return an array that includes a created database'
      temp_db = $.couch.db("temp_spec_db");
      temp_db.create();
      $.couch.allDbs({
        success: function(resp){
          resp.should.include "temp_spec_db"
        }
      });
      temp_db.drop();
    end
    
    it 'should return an array that does not include a database that does not exist'
      $.couch.allDbs({
        success: function(resp){
          resp.should.not.include("not_existing_temp_spec_db");
        }
      });
    end
  end
  
  describe 'config'
    it 'should get the config settings'
      $.couch.config({
        success: function(resp){
          resp.httpd.port.should.eql window.location.port
          resp.stats.samples.should.match /\[.*\]/
          resp.native_query_servers.should.have_prop "erlang"
        }
      });
    end
    
    it 'should get a specific config setting'
      $.couch.config({
        success: function(resp){
          parseInt(resp.max_document_size).should.be_a Number
          resp.delayed_commits.should.be_a String
          resp.database_dir.should.be_a String
        }
      }, "couchdb");
    end
    
    it 'should update a config setting'
      $.couch.config({
        success: function(resp){
          resp.should.eql ""
        }
      }, "test", "colony", "Caprica");
      
      $.couch.config({
        success: function(resp){
          resp.colony.should.eql "Caprica"
        }
      }, "test");
      
      $.couch.config({}, "test", "colony", null);
    end
    
    it 'should delete a config setting'
      $.couch.config({}, "test", "colony", "Caprica");
      
      $.couch.config({
        success: function(resp){
          resp.should.eql "Caprica"
        }
      }, "test", "colony", null);
      
      $.couch.config({
        success: function(resp){
          resp.should.eql {}
        }
      }, "test");
    end
  end
  
  describe 'session'
    it 'should return information about the session'
      $.couch.session({
        success: function(resp){
          resp.info.should.have_prop 'authentication_db'
          resp.userCtx.should.include 'name'
          resp.userCtx.roles.should.be_an Array
        }
      });
    end
  end
  
  describe 'userDb'
    it 'should return the userDb'
      var authentication_db;
      $.couch.session({
        success: function(resp){
          authentication_db = resp.info.authentication_db;
        }
      });
      
      $.couch.userDb(function(resp){
        resp.name.should.eql authentication_db
      });
    end
    
    it 'should return a db instance'
      $.couch.userDb(function(resp){
        resp.should.respond_to 'allDocs'
        resp.should.respond_to 'bulkSave'
      });
    end
  end
  
  describe 'user_db stuff'
    before
      useTestUserDb();
    end

    after
      useOldUserDb();
    end
    
    describe 'signup'
      it 'should return a saved user'
        $.couch.signup(
          {name: "Tom Zarek"}, "secretpass", {
          success: function(resp){
            resp.id.should.eql "org.couchdb.user:Tom Zarek"
            resp.rev.length.should.be_at_least 30
            resp.ok.should.be_true
            users_db.deleteDoc({_id : resp.id, _rev : resp.rev})
          }
        });
      end
    
      it 'should create a userDoc in the user db'
        $.couch.signup(
          {name: "Tom Zarek"}, "secretpass", {
          success: function(resp){
            var user = users_db.open(resp.id);
            user.name.should.eql "Tom Zarek"
            user._id.should.eql "org.couchdb.user:Tom Zarek"
            user.roles.should.eql []
            user.password_sha.length.should.be_at_least 30
            user.password_sha.should.be_a String
            users_db.deleteDoc({_id : resp.id, _rev : resp.rev})
          }
        });
      end
    
      it 'should create a userDoc with roles when specified'
        $.couch.signup(
          {name: "Tom Zarek", roles: ["vice_president", "activist"]}, "secretpass", {
          success: function(resp){
            var user = users_db.open(resp.id);
            user.roles.should.eql ["vice_president", "activist"]
            users_db.deleteDoc({_id : resp.id, _rev : resp.rev})
          }
        });
      end
    end
    
    describe 'login'
      before_each
        user = {};
        $.couch.signup({name: "Tom Zarek", roles: ["vice_president", "activist"]}, "secretpass", {
          success: function(resp){
            user.id  = resp.id;
            user.rev = resp.rev;
          }
        });
      end
      
      after_each
        users_db.deleteDoc({_id : user.id, _rev : user.rev})
      end
      
      it 'should return the logged in user'
        $.couch.login({
          name: "Tom Zarek", 
          password: "secretpass", 
          success: function(resp){
            resp.name.should.eql "Tom Zarek"
            resp.ok.should.be_true
            resp.roles.should.eql ["vice_president", "activist"]
          }
        });
      end
      
      it 'should result in a session for the logged in user'
        $.couch.login({
          name: "Tom Zarek", 
          password: "secretpass"
        });
        $.couch.session({
          success: function(resp){
            resp.info.authentication_db.should.eql "spec_users_db"
            resp.userCtx.name.should.eql "Tom Zarek"
            resp.userCtx.roles.should.eql ["vice_president", "activist"]
          }
        });
      end
      
      it 'should return a 404 when password is wrong'
        $.couch.login({
          name: "Tom Zarek", 
          password: "wrongpass", 
          error: function(status, error, reason){
            status.should.eql 401
            error.should.eql "unauthorized"
            reason.should.eql "Name or password is incorrect."
          }
        });
      end
      
      it 'should return a 404 when the user doesnt exist in the users db'
        $.couch.login({
          name: "Number Three", 
          password: "secretpass", 
          error: function(status, error, reason){
            status.should.eql 401
            error.should.eql "unauthorized"
            reason.should.eql "Name or password is incorrect."
          }
        });
      end
    end

    describe 'logout'
      before_each
        user = {};
        $.couch.signup({name: "Tom Zarek", roles: ["vice_president", "activist"]}, "secretpass", {
          success: function(resp){
            user.id  = resp.id;
            user.rev = resp.rev;
          }
        });
        $.couch.login({name: "Tom Zarek", password: "secretpass"});
      end
      
      after_each
        users_db.deleteDoc({_id : user.id, _rev : user.rev})
      end
      
      it 'should return ok true'
        $.couch.logout({
          success: function(resp){
            resp.ok.should.be_true
          }
        });
      end
      
      it 'should result in an empty session'
        $.couch.logout();
        $.couch.session({
          success: function(resp){
            resp.userCtx.name.should.be_null
            resp.userCtx.roles.should.not.include ["vice_president"]
          }
        });
      end
    end
  end

  describe 'encodeDocId'
    it 'should return the encoded docID when it is not a design document'
      $.couch.encodeDocId("viper").should.eql(encodeURIComponent("viper"))
    end
    
    it 'should encode only the name of the design document'
      $.couch.encodeDocId("_design/raptor").should.eql("_design/" + encodeURIComponent("raptor"))
    end
    
    it 'should also work when the name of the des'
      $.couch.encodeDocId("_design/battlestar/_view/crew").should.eql("_design/" + encodeURIComponent("battlestar/_view/crew"))
    end
  end
    
  describe 'info'
    it 'should return the CouchDB version'
      $.couch.info({
        success: function(resp){
          resp.couchdb.should.eql "Welcome"
          resp.version.should_match /^\d\d?\.\d\d?\.\d\d?.*/
        }
      });
    end
  end
  
  describe 'replicate'
    before_each
      db = $.couch.db("spec_db");
      db.create();
      db2 = $.couch.db("spec_db_2");
      db2.create();
      host = window.location.protocol + "//" + window.location.host ;
    end
    
    after_each
      db.drop();
      db2.drop();
    end
  
    it 'should return no_changes true when there are no changes between the dbs'
      $.couch.replicate(host + db.uri, host + db2.uri, {
        success: function(resp){
          resp.ok.should.be_true
          resp.no_changes.should.be_true
        }
      });
    end
    
    it 'should return the session ID'
      db.saveDoc({'type':'battlestar', 'name':'galactica'});
      $.couch.replicate(host + db.uri, host + db2.uri, {
        success: function(resp){
          resp.session_id.length.should.be_at_least 30
        }
      });
    end
    
    it 'should return source_last_seq'
      db.saveDoc({'type':'battlestar', 'name':'galactica'});
      db.saveDoc({'type':'battlestar', 'name':'pegasus'});
      
      $.couch.replicate(host + db.uri, host + db2.uri, {
        success: function(resp){
          resp.source_last_seq.should.eql 2
        }
      });
    end
    
    it 'should return the replication history'
      db.saveDoc({'type':'battlestar', 'name':'galactica'});
      db.saveDoc({'type':'battlestar', 'name':'pegasus'});
      
      $.couch.replicate(host + db.uri, host + db2.uri, {
        success: function(resp){
          resp.history[0].docs_written.should.eql 2
          resp.history[0].start_last_seq.should.eql 0
        }
      });
    end
    
    it 'should pass through replication options'
      db.saveDoc({'type':'battlestar', 'name':'galactica'});
      db2.drop();
      $.couch.replicate(host + db.uri, host + db2.uri, {
        error: function(status, error, reason){
          status.should.eql 500
          reason.should.match /db_not_found/
        }
      });
      
      // this is failing because the ajax call is ignoring the options. 
      $.couch.replicate(host + db.uri, host + db2.uri, {
        body : {"create_target":true},
        success: function(resp){
          resp.ok.should.eql true
          resp.history[0].docs_written.should.eql 1
        },
        error: function(status, error, reason){
          console.log('in error')
          console.log('status', status)
          console.log('error', error)
          console.log('reason', reason)
          status.should.not.eql 500
          error.should.not.eql 'case_clause'
          reason.should.be_empty
        }
      });
      
      db2.info({
        success: function(resp){
          resp.db_name.should.eql "spec_db_2"
        }
      });
    end
  end
  
  describe 'newUUID'
    it 'should return a new UUID'
      var new_uuid = $.couch.newUUID(1);
      new_uuid.should.be_a String
      new_uuid.should.have_length 32
    end
    
    it 'should fill the uuidCache with the specified number minus 1'
      // we can't reach the uuidCache from here, so we mock the next request 
      // to test that the next uuid is not coming from the request, but from the cache.
      $.couch.newUUID(2);
      mock_request().and_return({'uuids':['a_sample_uuid']})
      $.couch.newUUID(1).should.not.eql 'a_sample_uuid'
      $.couch.newUUID(1).should.eql 'a_sample_uuid'
    end
  end
end