interface IMove {
  index?: number;
  score?: number;
  depth?: number;
}

interface IStatus {
  player?: string;
  lastMove?: number;
  state?: boolean;
  draw?: boolean;
}

class Krestik {
  table: any[];
  botPlayer: string;
  status: IStatus = {};
  complete: boolean = false;

  constructor(public humanPlayer: string) {
    this.botPlayer = humanPlayer === 'x' ? 'o' : 'x';
    // this.table = ['x', 'o', 'x', 3, 'o', 5, 'x', 7, 8];
    this.table = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  public start(): IStatus {
    if (this.botPlayer === 'x') {
      this.botAction();
    }
    return this.status;
  }

  public clear(): void {
    this.table = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  public isComplete() {
    if (this.status.state || this.status.draw) {
      return true;
    } else {
      return false;
    }
  }

  public userAction(cell: number): IStatus {
    if (this.complete) return this.status;
    this.table[cell] = this.humanPlayer;

    this.status.player = this.humanPlayer;
    this.status.lastMove = cell;
    this.status.state = this.checkTable(this.table, this.humanPlayer);

    if (this.isComplete()) {
      return this.status;
    }

    return this.botAction();
  }

  public botAction(): IStatus {
    const cell = this.minimax(this.table, this.botPlayer);
    this.table[cell.index] = this.botPlayer;

    const emptyCells = this.getEmptyIndex(this.table).length;

    this.status.player = this.botPlayer;

    if (cell.index !== undefined && emptyCells) {
      this.status.lastMove = cell.index;
    } else {
      this.status.draw = true;
    }
    this.status.state = this.checkTable(this.table, this.botPlayer);

    return this.status;
  }

  private checkTable(table: any[], player: string): boolean {
    if (
      (table[0] == player && table[1] == player && table[2] == player) ||
      (table[3] == player && table[4] == player && table[5] == player) ||
      (table[6] == player && table[7] == player && table[8] == player) ||
      (table[0] == player && table[3] == player && table[6] == player) ||
      (table[1] == player && table[4] == player && table[7] == player) ||
      (table[2] == player && table[5] == player && table[8] == player) ||
      (table[0] == player && table[4] == player && table[8] == player) ||
      (table[2] == player && table[4] == player && table[6] == player)
    ) {
      return true;
    } else {
      return false;
    }
  }

  private getEmptyIndex(table: any[]): number[] {
    return table.filter(cell => cell !== 'o' && cell !== 'x');
  }


  private minimax(newTable: string[] | number[], currentPlayer: string, depth: number = 0): IMove {
    const availableCell = this.getEmptyIndex(newTable);
    depth += 1;

    if (this.checkTable(newTable, this.humanPlayer)) {
      return { score: -10, depth };
    } else if (this.checkTable(newTable, this.botPlayer)) {
      return { score: 10, depth };
    } else if (!availableCell.length) {
      return { score: 0, depth };
    }

    if (this.table.length === availableCell.length) {
      return { index: 0, score: 10 };
    }

    const moves: IMove[] = [];

    availableCell.forEach((cell, i) => {
      const move: IMove = {};

      move.index = <number>newTable[cell];

      newTable[cell] = currentPlayer;

      if (currentPlayer === this.botPlayer) {
        let minimaxMove = this.minimax(newTable, this.humanPlayer, depth);
        move.score = minimaxMove.score;
        move.depth = minimaxMove.depth;
      } else {
        let minimaxMove = this.minimax(newTable, this.botPlayer, depth);
        move.score = minimaxMove.score;
        move.depth = minimaxMove.depth;
      }

      newTable[cell] = move.index;

      moves.push(move);
    });

    let bestMove;
    if (currentPlayer === this.botPlayer) {
      let bestScore = -100;
      let depth = 1000;
      moves.forEach((val, i) => {
        if (val.score >= bestScore && val.depth < depth) {
          bestScore = val.score;
          depth = val.depth;
          bestMove = i;
        }
      });
    } else {
      let bestScore = 100;
      let depth = 1000;
      moves.forEach((val, i) => {
        if (val.score <= bestScore && val.depth < depth) {
          bestScore = val.score;
          depth = val.depth;
          bestMove = i;
        }
      });
    }

    return moves[bestMove];
  }
}

