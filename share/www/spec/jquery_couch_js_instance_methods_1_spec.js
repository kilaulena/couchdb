// Specs for jquery_couch.js lines 163-209

describe 'jQuery couchdb db'
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

      it 'should call _compact'
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

      it 'should call _compact'
        db.viewCleanup({
          success: function(resp, obj) {
            obj.url.should.eql "/spec_db/_view_cleanup"
          }
        });
      end
    end

    describe 'compactView'

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