this["Templates"] = this["Templates"] || {};

this["Templates"]["src/templates/main.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<h3>My App</h3>\n<p>Hello "
    + container.escapeExpression(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"user","hash":{},"data":data}) : helper)))
    + "!</p>\n";
},"useData":true});