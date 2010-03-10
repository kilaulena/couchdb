describe 'CouchDB instance'
  before_each
    db = new CouchDB("spec_db", {"X-Couch-Full-Commit":"false"});
  end
  
  describe '.request'
    it 'should return a XMLHttpRequest'
      db.createDb();
      var req = CouchDB.request("GET", "/spec_db");
      req.should.include 'readyState'
      req.should.include 'responseText'
      req.should.include 'statusText'
      // in Safari a XMLHttpRequest is actually a XMLHttpRequestConstructor, 
      // otherwise we could just do:
      // req.should.be_a XMLHttpRequest
      db.deleteDb();
    end
  end
  
  describe '.createDb'   
    after_each
      db.deleteDb();
    end
    
    it 'should create the db'
      db.createDb();
      db.last_req.status.should.eql 201
    end
    
    it 'should return the responseText of the request'
      db.createDb().should.eql {"ok" : true}
    end
    
    it 'should result in a created db'
      db.createDb();
      try{
        db.createDb();
      } catch(e) {
        e.error.should.eql "file_exists"
      }
    end
  end
  
  describe '.deleteDb'
    it 'should delete the db'
      db.createDb();
      db.deleteDb();
      db.last_req.status.should.eql 200
    end
    
    it 'should return the responseText of the request'
      db.createDb();
      db.deleteDb().should.eql {"ok" : true}
    end
    
    it 'should result in a deleted db'
      db.createDb();
      db.deleteDb();
      db.deleteDb();
      db.last_req.status.should.eql 404
    end
  end
end