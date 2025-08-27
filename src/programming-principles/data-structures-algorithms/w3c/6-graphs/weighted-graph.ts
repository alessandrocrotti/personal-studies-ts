export class WeightedGraph {
  private adjMatrix: number[][];
  private vertexData: string[];
  private size: number;
  private direction: "directed" | "undirected";

  constructor(size: number, direction: "directed" | "undirected" = "undirected") {
    this.size = size;
    this.adjMatrix = Array.from({ length: size }, () => Array(size).fill(0));
    this.vertexData = Array(size).fill("");
    this.direction = direction;
  }

  public addEdge(u: number, v: number, weight: number): void {
    if (this.isValidIndex(u) && this.isValidIndex(v)) {
      this.adjMatrix[u][v] = weight;
      if (this.direction === "undirected") {
        this.adjMatrix[v][u] = weight;
      }
    }
  }

  public addVertexData(vertex: number, data: string): void {
    if (this.isValidIndex(vertex)) {
      this.vertexData[vertex] = data;
    }
  }

  public getVertexData(): string[] {
    return this.vertexData;
  }

  public printGraph(): void {
    console.log("Adjacency Matrix:");
    this.adjMatrix.forEach((row) => {
      console.log(row.join(" "));
    });

    console.log("\nVertex Data:");
    this.vertexData.forEach((data, index) => {
      console.log(`Vertex ${index}: ${data}`);
    });
  }

  dijkstra(startVertexData: string): { distances: number[]; predecessors: (number | null)[] } {
    const startVertex = this.vertexData.indexOf(startVertexData);
    const distances: number[] = new Array(this.size).fill(Infinity);
    const predecessors = new Array<number | null>(this.size).fill(null);
    const visited: boolean[] = new Array(this.size).fill(false);

    distances[startVertex] = 0;

    for (let count = 0; count < this.size; count++) {
      let minDistance = Infinity;
      // Variable to track the vertex with the minimum distance
      let u: number | null = null;

      // Find the vertex with the minimum distance that hasn't been visited
      for (let i = 0; i < this.size; i++) {
        if (!visited[i] && distances[i] < minDistance) {
          minDistance = distances[i];
          u = i;
        }
      }

      // If no vertex is found, break the loop
      // This can happen if the graph is disconnected
      if (u === null) break;

      visited[u] = true;

      // Update distances for adjacent vertices
      for (let v = 0; v < this.size; v++) {
        if (this.adjMatrix[u][v] !== 0 && !visited[v]) {
          const alt = distances[u] + this.adjMatrix[u][v];
          if (alt < distances[v]) {
            distances[v] = alt;
            // Store the predecessor for path reconstruction
            predecessors[v] = u;
          }
        }
      }
    }

    return { distances, predecessors };
  }

  dijkstraWithDestination(startVertexData: string, endVertexData: string): { distance: number; path: string } {
    const start = this.vertexData.indexOf(startVertexData);
    const end = this.vertexData.indexOf(endVertexData);
    const distances = new Array(this.size).fill(Infinity);
    const predecessors: (number | null)[] = new Array(this.size).fill(null);
    const visited = new Array(this.size).fill(false);

    distances[start] = 0;

    for (let _ = 0; _ < this.size; _++) {
      let minDistance = Infinity;
      let u: number | null = null;

      for (let i = 0; i < this.size; i++) {
        if (!visited[i] && distances[i] < minDistance) {
          minDistance = distances[i];
          u = i;
        }
      }

      if (u === null || u === end) {
        console.log(`Breaking out of loop. Current vertex: ${this.vertexData[u!]}`);
        console.log("Distances:", distances);
        break;
      }

      visited[u] = true;
      console.log(`Visited vertex: ${this.vertexData[u]}`);

      for (let v = 0; v < this.size; v++) {
        if (this.adjMatrix[u][v] !== 0 && !visited[v]) {
          const alt = distances[u] + this.adjMatrix[u][v];
          if (alt < distances[v]) {
            distances[v] = alt;
            predecessors[v] = u;
          }
        }
      }
    }

    const path = this.getPath(predecessors, startVertexData, endVertexData);
    return { distance: distances[end], path };
  }

  getPath(predecessors: (number | null)[], startData: string, endData: string): string {
    const start = this.vertexData.indexOf(startData);
    const end = this.vertexData.indexOf(endData);
    const path: string[] = [];

    let current: number | null = end;
    while (current !== null) {
      path.unshift(this.vertexData[current]);
      if (current === start) break;
      current = predecessors[current];
    }

    return path.join("->");
  }

  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.size;
  }

  printDijkstra(params: { distances: number[]; predecessors: (number | null)[] }): void {
    const { distances, predecessors } = params;
    this.vertexData.forEach((label, i) => {
      const path = this.getPath(predecessors, "D", label);
      console.log(`${path}, Distance: ${distances[i]}`);
    });
  }

  bellmanFord(startVertexData: string): { hasNegativeCycle: boolean; distances: number[] | null } {
    const startVertex = this.vertexData.indexOf(startVertexData);
    const distances: number[] = new Array(this.size).fill(Infinity);
    distances[startVertex] = 0;

    // Edge relaxation
    for (let i = 0; i < this.size - 1; i++) {
      for (let u = 0; u < this.size; u++) {
        for (let v = 0; v < this.size; v++) {
          const weight = this.adjMatrix[u][v];
          if (weight !== 0 && distances[u] + weight < distances[v]) {
            distances[v] = distances[u] + weight;
            console.log(`Relaxing edge ${this.vertexData[u]}->${this.vertexData[v]}, Updated distance to ${this.vertexData[v]}: ${distances[v]}`);
          }
        }
      }
    }

    // Negative cycle detection (optional)
    for (let u = 0; u < this.size; u++) {
      for (let v = 0; v < this.size; v++) {
        const weight = this.adjMatrix[u][v];
        if (weight !== 0 && distances[u] + weight < distances[v]) {
          return { hasNegativeCycle: true, distances: null };
        }
      }
    }

    return { hasNegativeCycle: false, distances };
  }
}
