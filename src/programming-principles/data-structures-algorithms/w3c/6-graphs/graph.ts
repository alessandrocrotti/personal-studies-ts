export class Graph {
  private adjMatrix: number[][];
  private vertexData: string[];
  private size: number;
  private direction: "directed" | "undirected";
  // Union-Find parent array for cycle detection in undirected graphs
  private parent: number[];

  constructor(size: number, direction: "directed" | "undirected" = "undirected") {
    this.size = size;
    this.adjMatrix = Array.from({ length: size }, () => Array(size).fill(0));
    this.vertexData = Array(size).fill("");
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.direction = direction;
  }

  public addEdge(u: number, v: number): void {
    if (this.isValidIndex(u) && this.isValidIndex(v)) {
      this.adjMatrix[u][v] = 1;
      if (this.direction === "undirected") {
        this.adjMatrix[v][u] = 1;
      }
    }
  }

  public addVertexData(vertex: number, data: string): void {
    if (this.isValidIndex(vertex)) {
      this.vertexData[vertex] = data;
    }
  }

  public printGraph(): void {
    console.log("Adjacency Matrix:");
    this.adjMatrix.forEach((row) => console.log(row.join(" ")));

    console.log("\nVertex Data:");
    this.vertexData.forEach((data, index) => {
      console.log(`Vertex ${index}: ${data}`);
    });
  }

  public dfs(startVertexData: string): void {
    const visited = Array(this.size).fill(false);
    const startVertex = this.vertexData.indexOf(startVertexData);
    if (startVertex === -1) {
      console.log(`Start vertex "${startVertexData}" not found.`);
      return;
    }
    this.dfsUtil(startVertex, visited);
    console.log(); // for newline
  }

  /**
   * Utility function for DFS traversal.
   * Each time you find a new not-visited vertex, print it and get its adjacent vertices not yet visited and call this function recursively on them.
   * @param v - The current vertex index.
   * @param visited - Array to track visited vertices.
   */
  private dfsUtil(v: number, visited: boolean[]): void {
    visited[v] = true;
    console.log(this.vertexData[v] + " ");

    for (let i = 0; i < this.size; i++) {
      if (this.adjMatrix[v][i] === 1 && !visited[i]) {
        this.dfsUtil(i, visited);
      }
    }
  }

  /**
   * Utility function for DFS traversal.
   * Each time you find a new not-visited vertex, print it and get its adjacent vertices not yet visited and call this function recursively on them.
   * @param v - The current vertex index.
   * @param visited - Array to track visited vertices.
   * @param parent - The parent vertex index to avoid counting the edge back to the parent as a cycle.
   * @returns true if a cycle is detected, false otherwise.
   */
  private dfsUtilUndirectedCycles(v: number, visited: boolean[], parent: number): boolean {
    visited[v] = true;

    for (let i = 0; i < this.size; i++) {
      if (this.adjMatrix[v][i] === 1) {
        if (!visited[i]) {
          if (this.dfsUtilUndirectedCycles(i, visited, v)) return true;
        } else if (i !== parent) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   *
   * @param v - The current vertex index.
   * @param visited - Array to track visited vertices.
   * @param recStack - Array to track visited vertices during the recursion.
   * @returns
   */
  private dfsUtilDirectedCycles(v: number, visited: boolean[], recStack: boolean[]): boolean {
    visited[v] = true;
    recStack[v] = true;

    console.log("Current vertex:", this.vertexData[v]);

    for (let i = 0; i < this.size; i++) {
      if (this.adjMatrix[v][i] === 1) {
        if (!visited[i]) {
          if (this.dfsUtilDirectedCycles(i, visited, recStack)) return true;
        } else if (recStack[i]) {
          return true;
        }
      }
    }

    recStack[v] = false;
    return false;
  }

  private find(i: number): number {
    if (this.parent[i] === i) return i;
    return this.find(this.parent[i]);
  }

  private union(x: number, y: number): void {
    const xRoot = this.find(x);
    const yRoot = this.find(y);
    console.log("Union:", this.vertexData[x], "+", this.vertexData[y]);
    this.parent[xRoot] = yRoot;
    console.log(this.parent, "\n");
  }

  /**
   * Checks if the graph is cyclic using the union-find algorithm for directed graphs.
   * @returns true if the graph is cyclic, false otherwise.
   */
  isCyclicUnionForUndirected(): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = i + 1; j < this.size; j++) {
        if (this.adjMatrix[i][j]) {
          const x = this.find(i);
          const y = this.find(j);
          if (x === y) return true;
          this.union(x, y);
        }
      }
    }
    return false;
  }

  /**
   * Performs a breadth-first search (BFS) traversal starting from the specified vertex.
   * Each time you find a new not-visited vertex, print it and get its adjacent vertices not yet visited and add them to the queue, then dequeue the next vertex and repeat.
   * @param startVertexData - The data of the starting vertex for BFS traversal.
   */
  bfs(startVertexData: string): void {
    const queue: number[] = [this.vertexData.indexOf(startVertexData)];
    const visited: boolean[] = new Array(this.size).fill(false);
    visited[queue[0]] = true;

    while (queue.length > 0) {
      const currentVertex = queue.shift()!;
      console.log(this.vertexData[currentVertex]);

      for (let i = 0; i < this.size; i++) {
        if (this.adjMatrix[currentVertex][i] === 1 && !visited[i]) {
          queue.push(i);
          visited[i] = true;
        }
      }
    }
  }

  private isCyclicUndirected(): boolean {
    const visited = new Array(this.size).fill(false);

    for (let i = 0; i < this.size; i++) {
      if (!visited[i]) {
        if (this.dfsUtilUndirectedCycles(i, visited, -1)) return true;
      }
    }

    return false;
  }

  private isCyclicDirected(): boolean {
    const visited = new Array(this.size).fill(false);
    const recStack = new Array(this.size).fill(false);

    for (let i = 0; i < this.size; i++) {
      if (!visited[i]) {
        if (this.dfsUtilDirectedCycles(i, visited, recStack)) return true;
      }
    }
    return false;
  }

  isCyclic(): boolean {
    if (this.direction === "directed") {
      return this.isCyclicDirected();
    }
    return this.isCyclicUndirected();
  }

  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.size;
  }
}
