// Specs for jquery_couch.js lines 163-209


describe 'jQuery couchdb db'
  before
    alert = function(msg){
      console.log('alert: ', msg)
    };
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
  
  describe 'compact'
    it 'should description'
      // console.log(db.compact(), 'thats the result')
    end
  end

  describe 'viewCleanup'
    
  end
  
  describe 'compactView'
    
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
    
  end
end