document.getElementById('quiz').addEventListener('submit',function(e){
  e.preventDefault();
  var qs=document.querySelectorAll('fieldset.q'),score=0;
  qs.forEach(function(q){
    var picked=q.querySelector('input:checked'),ok=picked&&picked.value===q.dataset.correct;
    q.classList.remove('right','wrong');q.classList.add(ok?'right':'wrong');
    if(ok)score++;
    var fb=q.querySelector('.fb');
    fb.textContent=(ok?'Đúng. ':'Chưa đúng. ')+q.dataset.explain;
  });
  document.getElementById('result').textContent='Điểm: '+score+'/'+qs.length;
});
