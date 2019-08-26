class HasMany {
  $relatedModel = null;
  $foreignKey = null;
  $parentInstance = null;
  $parentKey = null;
  $relationName = null;
  
  constructor (Model, foreignKey, parentKey, relationName, parentInstance) {
    this.$relatedModel = Model;
    this.$foreignKey = foreignKey;
    this.$parentInstance = parentInstance;
    this.$parentKey = parentKey;
    this.$parentKeyValue = this.$parentInstance[parentKey];
    this.$relationName = relationName;

    this.$baseQuery = this.$relatedModel.query().where(this.$foreignKey, this.$parentKeyValue);
    
    return new Proxy(this, {
      get(target, name) {
        if (target[name]) {
          return target[name];
        }

        return target.$baseQuery[name];
      }
    });
  }

  save = function(obj) {
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => {
        item[this.$foreignKey] = this.$parentKeyValue;

        return item.save();
      }));
    }
    
    obj[this.$foreignKey] = this.$parentKeyValue;

    return obj.save();
  }

  first = async function() {
    const res = await this.$baseQuery.first();

    this.$parentInstance.setRelation(this.$relationName, res);

    return res;
  }

  get = async function() {
    const res = await this.$baseQuery.get();

    this.$parentInstance.setRelation(this.$relationName, res);

    return res;
  }
}

module.exports = HasMany;
