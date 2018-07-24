/**
 * A relationship contains two parent persons, and a collection of child persons
 * A relationship is represented by an edge between the parent nodes,
 *  and a collection of edges between the parent-edge and all children edges
 */
(function ($, window, undefined) {
    'use strict';
    var familyNode = window.familyNode = window.familyNode || {};

    function Relationship(dad, mom, kids) {
        this._dad = dad;
        this._mom = mom;
        this._kids = kids;

        this._createParentEdge();
        this._createKidEdges();
    }

    Relationship.prototype = {
        _createParentEdge: function () {
            this._parentEdge = window.visualElement.createParentEdge(this._dad.getNode(), this._mom.getNode());
        },
        _createKidEdges: function (parentEdge, kids){
            var edges = [];
            this._kids.forEach((kid) => {
                edges.push(window.visualElement.createChildEdge(this._parentEdge, kid.getNode()));
            });
            this._kidEdges = edges;
        }
    }

})(jQuery, window);