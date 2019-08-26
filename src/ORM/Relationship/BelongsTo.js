class BelongsTo {
  $relatedModel = null;
  $foreignKey = null;
  $modelInstance = null;
  $parentKey = null;
  $parentKeyValue = null;
  $relationName = null;
  $hasParentKeyValue = false;
  
  constructor (relatedModel, foreignKey, parentKey, relationName, modelInstance) {
    this.$relatedModel = relatedModel;
    this.$foreignKey = foreignKey;
    this.$parentKey = parentKey
    this.$modelInstance = modelInstance;
    this.$relationName = relationName;
    
    this.$hasParentKeyValue = !!this.$modelInstance[foreignKey];
    
    if (this.$hasParentKeyValue) {
      this.$parentKeyValue = this.$modelInstance[foreignKey];
  
      this.$baseQuery = this.$relatedModel.query().where(this.$parentKey, this.$parentKeyValue);
    }
    
    return new Proxy(this, {
      get(target, name) {
        if (name !== 'attachTo' && !target.$hasParentKeyValue) {
          throw Error('Model not attached to parent');
        }

        if (target[name]) {
          return target[name];
        }

        // Forcing hasOne to always return one element
        if (name === 'get') {
          return target.first;
        }

        return target.$baseQuery[name];
      }
    });
  }

  attachTo = function (parent) {
    this.$parentKeyValue = parent[this.$parentKey];
    this.$hasParentKeyValue = !!parent[this.$parentKey];
    
    this.$modelInstance[this.$foreignKey] = this.$parentKeyValue;

    return this.$modelInstance.save();
  }

  first = async function() {
    const res = await this.$baseQuery.first();

    this.$modelInstance.setRelation(this.$relationName, res);

    return res;
  }
}

module.exports = BelongsTo;
