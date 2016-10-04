"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var SeparatorComponent = (function () {
    function SeparatorComponent() {
        this.avatarUrl = 'https://avatars3.githubusercontent.com/u/1174557?v=3&s=466';
        this.pseudo = 'yllieth';
        this.fullname = 'Sylvain RAGOT';
        this.isOrganization = false;
    }
    SeparatorComponent.prototype.ngOnInit = function () { };
    SeparatorComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'lh-projects-separator',
            templateUrl: 'separator.component.html',
            styleUrls: ['separator.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], SeparatorComponent);
    return SeparatorComponent;
}());
exports.SeparatorComponent = SeparatorComponent;
//# sourceMappingURL=separator.component.js.map