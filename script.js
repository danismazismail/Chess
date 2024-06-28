// Kodu çalıştırmadan önce DOM'un tamamen yüklenmesini bekleyin

document.addEventListener('DOMContentLoaded',()=>{
    let board = null; // satranç tahtasını başlat
    const game = new Chess(); // yeni Chess.js oyun örneği oluştur
    const moveHistory = document.getElementById("move-history"); 
    let moveCount = 1;// hareket sayısını başlat
    let userColor = "w"; // kullanıcının rengini beyaz olarak başlat

    // bilgisayar için rastgele bir hareket yapma işlevi
    const makeRandomMove = ()=>{
        const possibleMoves = game.moves();

        if(game.game_over()){
            alert("Şah Mat!");
        }else{
            const randomIdx = Math.floor(Math.random()*possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move,moveCount); // hamle sayımı ile hareketi kaydedin ve görüntüleyin
            moveCount++; // hareket sayısını artır
        }
    };

    // Hareket geçmişinde bir hareketi kaydetme ve görüntüleme işlevi
    const recordMove= (move, count) => {
        const formattedMove = count%2===1 ?`${Math.ceil(count/2)}.${move}`:`${move}`+" -";
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;//en son hamleye otomatik kaydırma
    };

    //sürükleme konumunun başlangıcını işleme işlevi
    const onDragStart = (source, piece) => {
        //Kullanıcının renge göre yalnızca kendi parçalarını sürüklemesine izin ver
        return !game.game_over() && piece.search(userColor) === 0;
    };

    //tahtaya düşen bir parçayı idare etme işlevi
    const onDrop = (source, target) =>{
        const move = game.move({
            from: source,
            to: target,
            promotion:'q',
        });

        if(move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount); // hamle sayımı ile hareketi kaydedin ve görüntüleyin
        moveCount++;
    };

    // Bir parça snap animasyonunun sonunu işleme işlevi
    const onSnapEnd = () => {
        board.position(game.fen());
    };

    // satranç tahtası için yapılandırma seçenekleri
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
    
    // satranç tahtasını başlat
    board = Chessboard('board', boardConfig);

    // Tekrar oynat düğmesi için olay dinleyicisi

    document.querySelector('.play-again').addEventListener('click', ()=>{
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount =1;
        userColor = 'w';
    });

    // konumu ayarlama düğmesi için olay dinleyicisi
    document.querySelector(".set-pos").addEventListener("click",()=>{
        const fen = prompt("İstediğiniz pozisyon kodunu giriniz!");
        if(fen !== null){
            if(game.load(fen)){
                board.position(fen);
                moveHistory.textContent = "";
                moveCount =1;
                userColor = "w";                
            }else{
                alert("Geçersiz pozisyon kodu tekrar deneyiniz.");
            }
        }
    });
    // flip board düğmesi için olay dinleyicisi
    document.querySelector(".flip-board").addEventListener("click", ()=>{
        board.flip();
        makeRandomMove();
        //tahtayı çevirdikten sonra kullanıcının rengini değiştir
        userColor = userColor === "w" ? "b":"w";
    });
});