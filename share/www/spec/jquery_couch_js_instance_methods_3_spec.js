// Specs for jquery_couch.js lines 300-411

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

  describe 'removeDoc'
    before_each
      doc = {"Name" : "Louanne Katraine", "Callsign" : "Kat", "_id" : "123"};
      saved_doc = {};
      db.saveDoc(doc, {
        success: function(resp){
          saved_doc = resp; 
        }
      });
    end
    
    it 'should result in a deleted document'
      db.removeDoc({_id : "123", _rev : saved_doc.rev}, {
        success: function(resp){
          db.openDoc("123", {
            error: function(status, error, reason){
              status.should.eql 404
              error.should.eql "not_found"
              reason.should.eql "deleted"
            }
          });
        }
      });
    end
  
    it 'should return ok true, the ID and the revision of the deleted document'
      db.removeDoc({_id : "123", _rev : saved_doc.rev}, {
        success: function(resp){
          resp.ok.should.be_true
          resp.id.should.eql "123"
          resp.rev.should.be_a String
          resp.rev.length.should.be_at_least 30
        }
      });
    end
      
    it 'should record the revision in the deleted document'
      db.removeDoc({_id : "123", _rev : saved_doc.rev}, {
        success: function(resp){
          db.openDoc("123", {
            rev: resp.rev,
            success: function(resp2){
              resp2._rev.should.eql resp.rev
              resp2._id.should.eql resp.id
              resp2._deleted.should.be_true
            }
          });
        }
      });
    end
  end
  
  describe 'bulkRemove'
    before_each
      doc  = {"Name" : "Kara Thrace", "Callsign" : "Starbuck", "_id" : "123"};
      doc2 = {"Name" : "Karl C. Agathon", "Callsign" : "Helo", "_id" : "456"};
      doc3 = {"Name" : "Sharon Valerii", "Callsign" : "Boomer", "_id" : "789"};
      docs = [doc, doc2, doc3];
      
      db.bulkSave({"docs": docs}, {
        success: function(resp){
          for (var i = 0; i < docs.length; i++) {
            docs[i]._rev = resp[i].rev;
          }
        }
      });
    end
    
    it 'should remove all documents specified'
      db.bulkRemove({"docs": docs});
      db.allDocs({
        success: function(resp) { 
          resp.total_rows.should.eql 0
        }
      });
    end
    
    it 'should not remove documents that should not have been deleted'
      db.bulkRemove({"docs": [doc3]});
      db.allDocs({
        success: function(resp) { 
          resp.total_rows.should.eql 2
        }
      });
    end
    
    it 'should result in deleted documents'
      db.bulkRemove({"docs": docs}, {
        success: function(resp){
          db.openDoc("123", {
            error: function(status, error, reason){
              status.should.eql 404
              error.should.eql "not_found"
              reason.should.eql "deleted"
            }
          });
        }
      });
    end

    it 'should return the ID and the revision of the deleted documents'
      db.bulkRemove({"docs": docs}, {
        success: function(resp){
          resp[0].id.should.eql "123"
          resp[0].rev.should.be_a String
          resp[0].rev.length.should.be_at_least 30
          resp[1].id.should.eql "456"
          resp[1].rev.should.be_a String
          resp[1].rev.length.should.be_at_least 30
          resp[2].id.should.eql "789"
          resp[2].rev.should.be_a String
          resp[2].rev.length.should.be_at_least 30
        }
      });
    end

    it 'should record the revision in the deleted documents'
      db.bulkRemove({"docs": docs}, {
        success: function(resp){
          db.openDoc("123", {
            rev: resp[0].rev,
            success: function(resp2){
              resp2._rev.should.eql resp[0].rev
              resp2._id.should.eql resp[0].id
              resp2._deleted.should.be_true
            }
          });
        }
      });
    end
  end
  
  describe 'copyDoc'
    
  end
  
  describe 'query'
    
  end
  
  describe 'view'
    
  end
  
  describe 'getDbProperty'
    
  end
  
  describe 'setDbProperty'
    
  end
end