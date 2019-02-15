$("document").ready(function(){
    $.ajax({
        url:window.location.href,
        method:"POST",
        success:function(json){
            for(var i=0; i<json.length; i++){
                var link = document.createElement("a");
                link.classList.add("list-group-item", "list-group-item-action");
                link.setAttribute('data-id', json[i].idcourse);
                link.setAttribute('href', '');
                link.setAttribute('data-toggle', 'collapse');
                link.setAttribute('role', 'button');
                link.setAttribute('aria-expanded', 'true');
                link.setAttribute('aria-controls', '');
                link.append("Course du : " + new Date(json[i].datecourse).toLocaleDateString('fr-FR'));

                var date1 = new Date(json[i].fincourse);
                var date2 = new Date(json[i].debutcourse);
                var res = Math.abs(date1 - date2) / 1000;
                var hours = Math.floor(res / 3600) % 24;
                if(hours < 10)
                    hours = '0' + String(hours);
                var minutes = Math.floor(res / 60) % 60;
                if(minutes < 10)
                    minutes = '0' + String(minutes);
                var seconds = res % 60;
                if(seconds < 10)
                    seconds = '0' + String(seconds);
                var span3 = document.createElement("span");
                span3.classList.add("float-right", "margin-left-50");
                span3.append("Durée : " + hours + ":" + minutes + ":" + seconds);
                link.append(span3);

                var span2 = document.createElement("span");
                span2.classList.add("float-right", "margin-left-50");
                span2.append("Fin : " + new Date(json[i].fincourse).toLocaleTimeString());;
                link.append(span2);

                var span1 = document.createElement("span");
                span1.classList.add("float-right");
                span1.append("Début : " + new Date(json[i].debutcourse).toLocaleTimeString());
                link.append(span1);

                $("#listeCourse").append(link);
            }
            $(".list-group-item").click(function(){
                if(document.getElementById('info'+this.dataset.id) == null){
                    var target = this;
                    $.ajax({
                        url:window.location.href + "/infosCourse",
                        method:"POST",
                        data:target.dataset.id,
                        success:function(json){
                            var infosContainer = document.createElement("div");
                            infosContainer.classList.add("collapse");
                            infosContainer.id = "info"+json[0].idcourse;

                            var infos = document.createElement("div");
                            infos.classList.add("card", "card-body");

                            var chartBPM = document.createElement("div");
                            chartBPM.id = "chartBPM"+json[0].idcourse;

                            var chartSPE = document.createElement("div");
                            chartSPE.id = "chartSPE"+json[0].idcourse;

                            google.charts.load('current', {packages: ['corechart', 'line']});
                            google.charts.setOnLoadCallback(drawBackgroundColor);

                            function drawBackgroundColor() {
                                var data = new google.visualization.DataTable();
                                data.addColumn('string', 'X');
                                data.addColumn('number', 'Cardio');

                                for(var i=0; i<json.length; i++){
                                    var date = new Date(json[i].dateinfo).toLocaleTimeString()
                                    data.addRows([
                                        [date, json[i].cardio]
                                    ]);
                                }

                                var options = {
                                    hAxis: {
                                    title: 'Temps'
                                    },
                                    vAxis: {
                                    title: 'Bpm'
                                    },
                                    series: {
                                        0: { color: 'red' }
                                    }
                                };

                                var chart1 = new google.visualization.LineChart(document.getElementById('chartBPM'+json[0].idcourse));
                                chart1.draw(data, options);

                                var data2 = new google.visualization.DataTable();
                                data2.addColumn('string', 'X');
                                data2.addColumn('number', 'Vitesse');

                                for(var i=0; i<json.length; i++){
                                    var date = new Date(json[i].dateinfo).toLocaleTimeString()
                                    data2.addRows([
                                        [date, json[i].vitesse]
                                    ]);
                                }

                                var options2 = {
                                    hAxis: {
                                    title: 'Temps'
                                    },
                                    vAxis: {
                                    title: 'Km/H'
                                    }
                                };

                                var chart2 = new google.visualization.LineChart(document.getElementById('chartSPE'+json[0].idcourse));
                                chart2.draw(data2, options2);
                            }

                            infos.append(chartBPM);
                            infos.append(chartSPE);
                            infosContainer.append(infos);
                            target.append(infosContainer);

                            target.setAttribute('href', '#info'+json[0].idcourse);
                            target.setAttribute('aria-controls', 'info'+json[0].idcourse);
                            target.click();

                            console.log("Finish");
                        },
                        error:function(json){
                            console.log("Erreur");
                            console.log(json);
                        }
                    });
                }
            });
            console.log("Success");
        },
        error:function(json){
            console.log("Erreur");
            console.log(json);
        }
    });

    
   
});
