// Specs for jquery_couch.js lines 163-209

describe 'jQuery couchdb db'
  before
    stubAlert();
  end
  
  after
    destubAlert();
  end
  
  before_each
    db = $.couch.db('spec_db');
  end

  describe 'constructor'
    it 'should set the name'
      db.name.should.eql 'spec_db'
    end
    
    it 'should set the uri'
      db.uri.should.eql '/spec_db/'
    end
  end
  
  describe 'triggering db functions'
    before_each
      db.create();
    end

    after_each
      db.drop();
    end
    
    describe 'compact'
      it 'should return ok true'
        db.compact({
          success: function(resp) {
            resp.ok.should.be_true
          }
        });
      end
    
      it 'should trigger _compact'
        db.compact({
          success: function(resp, obj) {
            obj.url.should.eql "/spec_db/_compact"
          }
        });
      end
    end
    
    describe 'viewCleanup'
       it 'should return ok true'
         db.viewCleanup({
           success: function(resp) {
             resp.ok.should.be_true
           }
         });
       end
   
       it 'should trigger _view_cleanup'
         db.viewCleanup({
           success: function(resp, obj) {
             obj.url.should.eql "/spec_db/_view_cleanup"
           }
         });
       end
     end
   
    describe 'compactView'
      before_each
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
      end
      
      it 'should return ok true'
        db.compactView("spec_db", {
          success: function(resp) {
            resp.ok.should.be_true
          }
        });
      end
  
      it 'should trigger _compact_view with the groupname'
        db.compactView("spec_db", {
          success: function(resp, obj) {
            obj.url.should.eql "/spec_db/_compact/spec_db"
          }
        });
      end
      
      it 'should return raise a 404 error when the design name doesnt exist'
        db.compactView("non_existing_db_name", {
          error: function(status, error, reason){
             status.should.eql 404
             error.should.eql "not_found"
             reason.should.eql "missing"
           }
        });
      end
    end
  end
   
  describe 'create'
    after_each
      db.drop();
    end
  
    it 'should return ok true'
      db.create({
        success: function(resp) {
          resp.ok.should.be_true
        }
      });
    end
    
    it 'should result in a created db'
      db.create();
      db.create({
        error: function(status, error, reason){
          status.should.eql 412
          error.should.eql "file_exists"
          reason.should.eql "The database could not be created, the file already exists."
        }
      });
    end
  end
  
  describe 'drop'
    before_each
      db.create();
    end
    
    it 'should return ok true'
      db.drop({
        success: function(resp) {
          resp.ok.should.be_true
        }
      });
    end
    
    it 'should result in a deleted db'
      db.drop();
      db.drop({
        error: function(status, error, reason){
          status.should.eql 404
          error.should.eql "not_found"
          reason.should.eql "missing"
        }
      });
    end
  end
end