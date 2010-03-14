// Specs for couch.js lines 326-483

describe 'CouchDB instance'
  before_each
    db = new CouchDB("spec_db", {"X-Couch-Full-Commit":"false"});
    db.createDb();
  end
  
  after_each 
    db.deleteDb();
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
end