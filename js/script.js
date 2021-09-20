// JavaScript Document

class Node {
    constructor(id, x, y, finalWeight = null) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.finalWeight = finalWeight;
    }
}

class Graph {
    constructor() {
        this.nodesList = [];
        this.edgesMatrix = [];
        this.nodeCounter = 0;
    }

    setMatrix() {
        this.edgesMatrix = [];
        for (let i = 1; i <= this.nodeCounter; i++) {
            this.edgesMatrix[i] = [];
            for (let j = 1; j <= this.nodeCounter; j++) {
                this.edgesMatrix[i][j] = null;
            }
        }
    }

    insertNode(x, y) {
        this.nodeCounter++;
        let newNode = new Node(this.nodeCounter, x, y);
        this.nodesList[this.nodeCounter] = newNode;
        this.setMatrix();
    }

    insertEdge(from, to, weight) {
        this.edgesMatrix[from][to] = weight;
    }

    insertEdge(from, to, weight) {
        this.edgesMatrix[from][to] = weight;
    }

    djikstra(graphOut) {
        let mins = [];
        let minsTemp = [];
        let parents = [];
        let visited = [];

        for (let i = 1; i < this.nodesList.length; i++) {
            visited[i] = false;
            parents[i] = null;
            mins[i] = null;
            minsTemp[i] = Number.POSITIVE_INFINITY;
        }

        parents[1] = 0;
        mins[1] = 0;
        minsTemp[1] = 0;

        let completed = false;
        let pivot = 1;
        while (!completed) {
            let pivotEdges = this.edgesMatrix[pivot];

            let accum = minsTemp[pivot];
            for (let i = 1; i <= pivotEdges.length; i++) {
                if (visited[i] == false) {
                    if (this.edgesMatrix[pivot][i] != null && accum + this.edgesMatrix[pivot][i] < minsTemp[i]) {
                        minsTemp[i] = accum + this.edgesMatrix[pivot][i];
                        parents[i] = pivot;
                    }
                }
            }
            visited[pivot] = true;
            mins[pivot] = minsTemp[pivot];
            if (parents[pivot] != 0) {
                graphOut.insertEdge(
                    parents[pivot],
                    pivot,
                    this.edgesMatrix[parents[pivot]][pivot]
                );

                console.log('mins[pivot]', mins[pivot]);
                graphOut.nodesList[pivot].finalWeight = mins[pivot];
            }

            //asignar el sig nodo
            let temp = Number.POSITIVE_INFINITY;
            for (let i = 1; i <= minsTemp.length; i++) {
                if (visited[i] == false && minsTemp[i] < temp) {
                    pivot = i;
                    temp = minsTemp[i];
                }
            }

            //verificar completed
            completed = true;
            for (let i = 1; i <= visited.length; i++) {
                if (visited[i] == false) {
                    completed = false;
                }
            }
        }

        console.log('graphOut', graphOut.nodesList);

    }

    prim(graphOut) {
        let parents = [];
        let visited = [];
        let mins = [];

        for (let i = 1; i < this.nodesList.length; i++) {
            visited[i] = false;
            parents[i] = null;
            mins[i] = Number.POSITIVE_INFINITY;
        }

        parents[1] = 0;
        visited[1] = true;
        mins[1] = 0;


        let completed = false;
        let pivot = 1;
        while (!completed) {
            console.log('Inicia bucle');
            console.log('pivot', pivot);
            let pivotEdges = this.edgesMatrix[pivot];

            //asignar arreglo de minimos
            for (let i = 1; i <= pivotEdges.length; i++) {
                if (visited[i] == false && this.edgesMatrix[pivot][i] != null && this.edgesMatrix[pivot][i] < mins[i]) {
                    mins[i] = this.edgesMatrix[pivot][i];
                    parents[i] = pivot;
                }
            }

            //asignar siguiente pivote
            let temp = Number.POSITIVE_INFINITY;
            for (let i = 1; i <= mins.length; i++) {
                if (visited[i] == false && mins[i] < temp) {
                    temp = mins[i];
                    pivot = i;
                }
            }

            visited[pivot] = true;
            //parents[pivot] = parentPivot;
            graphOut.insertEdge(
                parents[pivot],//padre
                pivot,//hijo
                this.edgesMatrix[parents[pivot]][pivot]//peso
            );

            completed = true;
            for (let i = 1; i <= visited.length; i++) {
                if (visited[i] == false) {
                    completed = false;
                }
            }
            console.log('completed', completed)
            console.log('visited', visited)
            console.log('parents', parents)
            console.log('mins', mins)
            console.log('');
        }
    }
}

const graph1 = new Graph();
const graph2 = new Graph();
const graph3 = new Graph();
let insertData = true;

function insertNode(x, y) {
    if (insertData == true) {
        graph1.insertNode(x, y);
        graph2.insertNode(x, y);
        graph3.insertNode(x, y);
        drawTable();
        drawGraph(graph1, 'network1');
        drawGraph(graph2, 'network2');
        drawGraph(graph3, 'network3');
    }
}

function insertEdges() {
    let allFilled = true;
    for (let i = 1; i < graph1.edgesMatrix.length; i++) {
        let colFilled = false;
        for (let j = 1; j <= graph1.edgesMatrix.length; j++) {
            if ($('#edge_' + i + '_' + j).val() > 0 || $('#edge_' + i + '_' + j).val() == '0') {
                colFilled = true;
                console.log('col'+i+' full');
            }
        }
        if (!colFilled) {
            allFilled = false;
        }
        console.log('allFilled',i,allFilled);
    }

    if(allFilled){
        for (let i = 1; i <= graph1.edgesMatrix.length; i++) {
            for (let j = 1; j <= graph1.edgesMatrix.length; j++) {
                if ($('#edge_' + i + '_' + j).val() > 0 || $('#edge_' + i + '_' + j).val() == '0') {
                    let val = $('#edge_' + i + '_' + j).val();
                    graph1.insertEdge(i, j, parseInt(val))
                }
            }
        }
        insertData = false;
        for (let i = 1; i < graph1.nodesList.length; i++) {
            for (let j = 1; j < graph1.nodesList.length; j++) {
                $('#edge_' + i + '_' + j).attr("readonly", true);
                $("#setEdgesBtn").attr("disabled", true);
            }
        }
        graph1.djikstra(graph2);
        graph1.prim(graph3);
        drawGraph(graph1, 'network1');
        drawGraph(graph2, 'network2');
        drawGraph(graph3, 'network3');
    }else{
        alert('Todos los nodos deben tener por lo menos una arista');
    }

}

function drawGraph(graph, divId) {
    // create an array with nodes
    let nodesData = [];
    let nodesList = graph.nodesList;
    for (let i = 1; i < nodesList.length; i++) {
        let node = nodesList[i];

        if (node.finalWeight == null) {
            nodesData.push({
                id: node.id,
                label: node.id.toString(),
                x: node.x,
                y: node.y,
                color: (i != 1 ?
                    { background: '#97C2FC' } :
                    { background: '#F00' }),
                font: (i != 1 ?
                    { color: '#000' } :
                    { color: '#FFF' })
            });
        } else {
            nodesData.push({
                id: node.id,
                label: node.id.toString() + ',' + node.finalWeight.toString(),
                x: node.x,
                y: node.y,
                color: (i != 1 ?
                    { background: '#97C2FC' } :
                    { background: '#F00' }),
                font: (i != 1 ?
                    { color: '#000' } :
                    { color: '#FFF' })
            });
        }
    }
    let nodes = new vis.DataSet(nodesData);

    // create an array with edges
    let edgesData = [];
    let edgesMatrix = graph.edgesMatrix;
    for (let i = 1; i <= edgesMatrix.length; i++) {
        if (Array.isArray(edgesMatrix[i]) && edgesMatrix[i].length > 0) {
            for (let j = 0; j < edgesMatrix[i].length; j++) {
                if (edgesMatrix[i][j] !== NaN && edgesMatrix[i][j] !== null) {
                    edgesData.push({ from: i, to: j, label: String(edgesMatrix[i][j]) });
                }
            }
        }
    }
    let edges = new vis.DataSet(edgesData);

    // create a network
    let container = document.getElementById(divId);

    // provide the data in the vis format
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        edges: {
            smooth: false
        },
        physics: false,
        interaction: {
            dragNodes: false,
            zoomView: false,
            dragView: false
        }
    };

    // initialize your network!
    let network = new vis.Network(container, data, options);
    network.on('click', function (e) { onClick(e) });

    /* DEFINE CALLBACKS HERE */
    function onClick(e) {
        insertNode(e.pointer.canvas.x, e.pointer.canvas.y);
    }
}

function drawTable() {
    let html =

        '<thead class="thead-dark"><tr>';
    html += '<th></th>';
    for (let i = 1; i < graph1.nodesList.length; i++) {
        html +=
            '<th>' + i + '</th>';
    }
    html +=
        '</tr></thead><tbody>';
    for (let i = 1; i < graph1.nodesList.length; i++) {
        html += "<tr>";
        html += "<th>" + i + "</th>";
        for (let j = 1; j < graph1.nodesList.length; j++) {
            html += "<td>";

            if (j > i) {
                html +=
                    '<div class="form-group">' +
                    '<input type="number" step="1" min="0" name="edge_' + i + '_' + j + '" id="edge_' + i + '_' + j + '" class="form-control" onChange="copyField(' + i + ',' + j + ')">'
                '</div>';
            } else if (j == i) {
                html +=
                    '<div class="form-group">' +
                    '<input type="text" name="edge_' + i + '_' + j + '" id="edge_' + i + '_' + j + '" value="-----" class="form-control" readonly>'
                '</div>';
            } else {
                html +=
                    '<div class="form-group">';
                html +=
                    '<div class="form-group">' +
                    '<input type="text" value=""  name="edge_' + i + '_' + j + '" id="edge_' + i + '_' + j + '" class="form-control" readonly>'
                '</div>';
                '</div>';
            }


            html += "</td>";
        }
        html += "</tr>";
    }
    html +=
        '</tbody>';
    $('#edgesTable').html(html);
}

function copyField(i, j) {
    $('#edge_' + j + '_' + i + '').val($('#edge_' + i + '_' + j + '').val());
}

drawGraph(graph1, 'network1');
drawGraph(graph2, 'network2');
drawGraph(graph3, 'network3');
