// Specs for jquery_couch.js lines 210-299

describe 'jQuery couchdb db'
  before
    stubAlert();
  end
  
  after
    destubAlert();
  end
  
  before_each
    db = $.couch.db('spec_db');
    db.create();
  end

  after_each
    db.drop();
  end

  describe 'info'
    before_each
      result = {};
      db.info({
        success: function(resp) { result = resp; }
      });
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
  
  describe 'allDocs'
    it 'should return no docs when there arent any'
      db.allDocs({
        success: function(resp) { 
          resp.total_rows.should.eql 0
          resp.rows.should.eql []
        }
      });
    end
    
    describe 'with docs'
      before_each
        db.saveDoc({"Name" : "Felix Gaeta",      "_id" : "123"});
        db.saveDoc({"Name" : "Samuel T. Anders", "_id" : "456"});
      end
    
      it 'should return all docs'
        db.allDocs({
          success: function(resp) { 
            resp.total_rows.should.eql 2
            resp.rows.should.have_length 2
            resp.rows[0].id.should.eql "123"
            resp.rows[0].key.should.eql "123"
            resp.rows[0].value.rev.length.should.be_at_least 30
            resp.rows[1].id.should.eql "456"
          }
        });
      end
    
      it 'should pass through the keys'
        db.allDocs({
          "startkey": "123", 
          "limit": "1",
          success: function(resp) { 
            resp.rows.should.have_length 1
            resp.rows[0].id.should.eql "123"
          }
        });
      end
    end
  end
  
  describe 'allDesignDocs'
    it 'should return nothing when there arent any design docs'
      db.saveDoc({"Name" : "Felix Gaeta", "_id" : "123"});
      db.allDesignDocs({
        success: function(resp) { 
          resp.rows.should.eql []
        }
      });
    end
    
    it 'should return all design docs'
      var designDoc = {
        "views" : {
          "people" : {
            "map" : "function(doc) { emit(doc._id, doc); }"
          }
        },
        "_id" : "_design/spec_db"
      };
      db.saveDoc(designDoc);
      db.saveDoc({"Name" : "Felix Gaeta", "_id" : "123"});
      
      db.allDesignDocs({
        success: function(resp) { 
          resp.total_rows.should.eql 2
          resp.rows.should.have_length 1
          resp.rows[0].id.should.eql "_design/spec_db"
          resp.rows[0].key.should.eql "_design/spec_db"
          resp.rows[0].value.rev.length.should.be_at_least 30
        }
      });
    end
  end
  
  describe 'allApps'
    
  end
  
  describe 'openDoc'
    
  end
  
  describe 'saveDoc'
    
  end
  
  describe 'bulkSave'
    
  end
end