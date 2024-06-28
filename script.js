// Wait for the DOM to be fully loaded before executing code

document.addEventListener('DOMContentLoaded',()=>{
    let board = null; // initialize the chessboard
    const game = new Chess(); // create new Chess.js gameinstance}
    const moveHistory = document.getElementById("move-history"); // get move history container
    let moveCount = 1;//initialize the move count
    let userColor = "w"; // initialize the user's color as white

    // function to make a random move for the computer
    const makeRandomMove = ()=>{
        const possibleMoves = game.moves();

        if(game.game_over()){
            alert("Şah Mat!");
        }else{
            const randomIdx = Math.floor(Math.random()*possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move,moveCount); // record and display the move with move count
            moveCount++; // increament the move count
        }
    };

    // function to record and display a move in the move history
    const recordMove= (move, count) => {
        const formattedMove = count%2===1 ?`${Math.ceil(count/2)}.${move}`:`${move}`+" -";
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;//autoscroll to the latest move
    };

    //function to handle the start of a drag position
    const onDragStart = (source, piece) => {
        //Allow the user to drag only their own pieces based on color
        return !game.game_over() && piece.search(userColor) === 0;
    };

    //function to handle a piece drop on the board
    const onDrop = (source, target) =>{
        const move = game.move({
            from: source,
            to: target,
            promotion:'q',
        });

        if(move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount); // record and display the move with move count
        moveCount++;
    };

    // function to handle the end of a piece snap animation
    const onSnapEnd = () => {
        board.position(game.fen());
    };

    // configuration options for the chessboard
    const boardConfig = {
        showNotation: true,
        draggable:true,
        position:'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed:'fast',
        snapBackSpeed:500,
        snapSpeed:100,
    };
    
    // initialize the chessboard
    board = Chessboard('board', boardConfig);

    // event listener for the play again button

    document.querySelector('.play-again').addEventListener('click', ()=>{
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount =1;
        userColor = 'w';
    });

    // event listener for the set position button
    document.querySelector(".set-pos").addEventListener("click",()=>{
        const fen = prompt("Enter the FEN notation for the desired position!");
        if(fen !== null){
            if(game.load(fen)){
                board.position(fen);
                moveHistory.textContent = "";
                moveCount =1;
                userColor = "w";                
            }else{
                alert("Invalid FEN notation. Please try again");
            }
        }
    });
    // event listener for the  flip board button
    document.querySelector(".flip-board").addEventListener("click", ()=>{
        board.flip();
        makeRandomMove();
        //toggle user's color after flipping the board
        userColor = userColor === "w" ? "b":"w";
    });
});