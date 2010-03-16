// Specs for couch.js lines 132-272

describe 'CouchDB instance'
  before_each
    db = new CouchDB("spec_db", {"X-Couch-Full-Commit":"false"});
    db.createDb();
  end
  
  after_each 
    db.deleteDb();
  end
  
  describe '.ensureFullCommit'
    it 'should return ok true'
      db.ensureFullCommit().ok.should.be_true
    end
    
    it 'should return the instance start time'
      db.ensureFullCommit().instance_start_time.should.have_length 16
    end
    
    it 'should post _ensure_full_commit to the db'
      db.should.receive('request', 'once').with_args("POST", "/spec_db/_ensure_full_commit")
      db.ensureFullCommit();
    end
  end
  
  describe '.query'
    
  end
  
  describe '.view'
    
  end
  
  describe '.info'
    before_each
      result = db.info();
    end
    
    it 'should return the name of the database'
      result.db_name.should.eql "spec_db"
    end
    
    it 'should return the number of documents'
      result.doc_count.should.eql 0
    end
    
    it 'should return the start time of the db instance'
      result.instance_start_time.should.have_length 16
    end
  end
  
  describe '.designInfo'
    before_each
      designDoc = {
        "views" : {
          "people" : {
            "map" : "function(doc) { emit(doc._id, doc); }"
          }
        },
        "_id" : "_design/spec_db"
      };
      db.save(designDoc);
      result = db.designInfo("_design/spec_db");
    end
    
    it 'should return the database name'
      result.name.should.eql "spec_db"
    end  
        
    it 'should return a views language'
      result.view_index.language.should.eql "javascript"
    end  
  
    it 'should return a views update sequence'
      result.view_index.update_seq.should.eql 0
    end  
  
    it 'should return a views signature'
      result.view_index.signature.should.have_length 32
    end  
  end
  
  
  describe '.allDocs'
    
  end
  
  describe '.designDocs'
    
  end
  
  describe '.changes'
    it 'should return no changes when there arent any'
      db.changes().last_seq.should.eql 0
      db.changes().results.should.eql []
    end
    
    describe 'with changes'
      before_each
        db.save({"Name" : "Felix Gaeta", "_id" : "123"});
        db.save({"Name" : "Samuel T. Anders", "_id" : "456"});
      end
    
      it 'should return changes'
        var result = db.changes();

        result.last_seq.should.eql 2
        result.results[0].id.should.eql "123"
        result.results[0].seq.should.eql 1
        result.results[0].changes[0].rev.length.should.be_at_least 30
        result.results[1].id.should.eql "456"
        result.results[1].seq.should.eql 2
        result.results[1].changes[0].rev.length.should.be_at_least 30
      end
    
      it 'should pass through the options'
        var result = db.changes({"since":"1"});
      
        result.last_seq.should.eql 2
        result.results[0].id.should.eql "456"
        result.results[0].seq.should.eql 2
        result.results[0].changes[0].rev.length.should.be_at_least 30
      end
      
      it 'should pass through the keys'
        // var result = db.changes({}, );
        
      end
      
      it 'should pass through the options and the keys'
        // var result = db.changes({"since":"1"}, );
        
      end
    end
  end
  
  describe '.compact'
    it 'should return ok true'
      db.compact().ok.should.be_true
    end
    
    it 'should post _compact to the db'
      db.should.receive('request', 'once').with_args("POST", "/spec_db/_compact")
      db.compact();
    end
  end
  
  describe '.viewCleanup'
    it 'should return ok true'
      db.viewCleanup().ok.should.be_true
    end
    
    it 'should post _view_cleanup to the db'
      db.should.receive('request', 'once').with_args("POST", "/spec_db/_view_cleanup")
      db.viewCleanup();
    end
  end
  
  describe '.setDbProperty'
    it 'should return ok true'
      db.setDbProperty('_revs_limit', 1500).ok.should.be_true
    end
    
    it 'should set a db property'
      db.setDbProperty('_revs_limit', 1500);
      db.getDbProperty('_revs_limit').should.eql 1500
      db.setDbProperty('_revs_limit', 1200);
      db.getDbProperty('_revs_limit').should.eql 1200
    end
  end
  
  describe '.getDbProperty'
    it 'should get a db property'
      db.setDbProperty('_revs_limit', 1200); 
      db.getDbProperty('_revs_limit').should.eql 1200
    end
   
    it 'should throw an error when the property doesnt exist'
      -{ db.getDbProperty('_doesnt_exist')}.should.throw_error
    end
  end 
  
  describe '.setSecObj'
    // it 'should return ok true'
    //   db.setSecObj({'readers':['bill']}).ok.should.be_true
    // end
    //   
    // it 'should save the given object into the _security object '
    //   db.should.receive('request', 'once').with_args("PUT", "/spec_db/_security", {body: '{"admins":["bill"]}'})
    //   db.setSecObj({'admins':['bill']})
    // end
  end
  
  describe '.getSecObj'
    it 'should get the security object'
      db.setSecObj({'reader':['bill']})
      db.getSecObj().should.eql {'reader':['bill']}
    end
    
    it 'should return an empty object when there is no security object'
      db.getSecObj().should.eql {}
    end
  end
end