"use strict";
var router_1 = require('@angular/router');
var projects_component_1 = require('./projects/projects.component');
var locales_component_1 = require('./locales/locales.component');
var appRoutes = [
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
    { path: 'projects', component: projects_component_1.ProjectsComponent },
    { path: 'locales', component: locales_component_1.LocalesComponent }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map