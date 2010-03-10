// Specs for couch.js lines 1-130

describe 'CouchDB instance'
  before_each
    db = new CouchDB("spec_db", {"X-Couch-Full-Commit":"false"});
  end
  
  describe '.request'
    it 'should return a XMLHttpRequest'
      db.createDb();
      var req = db.request("GET", "/spec_db");
      req.should.include 'readyState'
      req.should.include 'responseText'
      req.should.include 'statusText'
      // in Safari a XMLHttpRequest is actually a XMLHttpRequestConstructor, 
      // otherwise we could just do:
      // req.should.be_a XMLHttpRequest
      db.deleteDb();
    end
    
    it 'should do something with the options'
      
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
    before_each
      db.createDb();
    end
  
    it 'should delete the db'
      db.deleteDb();
      db.last_req.status.should.eql 200
    end
    
    it 'should return the responseText of the request'
      db.deleteDb().should.eql {"ok" : true}
    end
    
    it 'should result in a deleted db'
      db.deleteDb();
      db.deleteDb();
      db.last_req.status.should.eql 404
    end
  end
  
  describe 'docs'
    before_each
      doc = {"Name" : "Kara Thrace", "Callsign" : "Starbuck"};
      db.createDb();
    end
  
    after_each
      db.deleteDb();
    end
    
    describe '.save'
      it 'should save the document'
        db.save(doc);
        db.last_req.status.should.eql 201
      end
    
      it 'should result in a saved document'
        var response  = db.save(doc);
        var saved_doc = db.open(response.id);
        saved_doc.Name.should.eql "Kara Thrace"
        saved_doc.Callsign.should.eql "Starbuck"
      end
    
      it 'should return ok true'
        db.save(doc).ok.should.be_true
      end
    
      it 'should return ID and revision of the document'
        var response = db.save(doc);
        response.id.should.be_a String
        response.id.length.should.be_greater_than 10
        response.rev.should.be_a String
        response.rev.length.should.be_greater_than 10
      end
    
      it 'should save the document with the specified ID'
        doc._id = "123";
        var response = db.save(doc);
        response.id.should.eql "123"
      end
    
      // this isn't implemented, I think it would be nice to have?
      it 'should save the document with a number as ID'
        doc._id = 123;
        var response = db.save(doc);
        response.id.should.eql 123
      end
    
      it 'should do something with the options'
      
      end
    end
  
    describe '.open'
      before_each
        doc._id = "123";
        db.save(doc);
      end
  
      it 'should open the document'
        db.open("123").should.eql doc
      end
    
      it 'should return null when there is no document with the given ID'
        db.open("non_existing").should.be_null
      end
    
      it 'should do something with the options'
      
      end
    end
  
    describe '.deleteDoc'
      before_each
        doc._id = "123";
        saved_doc = db.save(doc);
        delete_response = db.deleteDoc({_id : "123", _rev : saved_doc.rev});
      end
      
      it 'should delete the document'
        db.last_req.status.should.eql 200
      end
    
      it 'should result in a deleted document'
        db.open("123").should.be_null
      end
    
      it 'should mark the document as deleted'
        var responseText = db.request("GET", "/spec_db/123").responseText;
        JSON.parse(responseText).should.eql {"error":"not_found","reason":"deleted"}
      end
    
      it 'should record the revision in the deleted document'
        var responseText = db.request("GET", "/spec_db/123?rev=" + delete_response.rev).responseText;
        var deleted_doc = JSON.parse(responseText);
        deleted_doc._rev.should.eql delete_response.rev
        deleted_doc._id.should.eql delete_response.id
      end
    
      it 'should return ok true, the ID and the revision of the deleted document'
        delete_response.ok.should.be_true
        delete_response.id.should.eql "123"
        delete_response.should.have_property 'rev'
      end
    end
  end
end