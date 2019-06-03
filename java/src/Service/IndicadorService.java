package Service;

import org.simpleframework.http.Request;

import Main.Evento;
import Main.Inscricao;

/* Falta: 
 * 
 * Percentual do n�mero de desistentes em rela��o ao n�mero total de inscritos
 * Percentual do n�mero de participantes confirmados em rela��o ao n�mero de inscri��es
 * 
 * Necess�rio campo para definir status de confirma��o para ent�o definir os parametros de indicador
 */


public class IndicadorService {
	
	private EventoService eventoService;

	public IndicadorService(EventoService eventoService) {
		this.eventoService = eventoService;
	}

	
	
	public double porcInsc(Request request) {
		Evento evento;
		if ((evento = eventoService.getEvento(request)) != null) {
			return evento.getInscricoes().size()/evento.getCapacidade()*100;
		}
		return 0;
	}
	
	
	
	public double pagouParcial(Request request) {
		Evento evento;
		if ((evento = eventoService.getEvento(request)) != null) {
			double i=0;
			for(Inscricao in: evento.getInscricoes()) {
				if(!in.estaPago()) {
					i++;
				}
			}
			return i/evento.getInscricoes().size()*100;
		}
		return 0;
	}
	

	
	public double pagouTotal(Request request) {
		Evento evento;
		if ((evento = eventoService.getEvento(request)) != null) {
			double i=0;
			for(Inscricao in: evento.getInscricoes()) {
				if(in.estaPago()) {
					i++;
				}
			}
			return i/evento.getInscricoes().size()*100;
		}
		return 0;
	}
	
	
	
	public double pagouDebito(Request request) {
		Evento evento;
		if ((evento = eventoService.getEvento(request)) != null) {
			double i=0;
			for(Inscricao in: evento.getInscricoes()) {
				if(in.getTipoPagamento() == "D�bito" || in.getTipoPagamento() == "Dinheiro") {
					i++;
				}
			}
			return i/evento.getInscricoes().size()*100;
		}
		return 0;
	}
	
	
	
	
	
	public double pagouCredito(Request request) {
		Evento evento;
		if ((evento = eventoService.getEvento(request)) != null) {
			double i=0;
			for(Inscricao in: evento.getInscricoes()) {
				if(in.getTipoPagamento() == "Cr�dito" || in.getTipoPagamento() == "Cheque") {
					i++;
				}
			}
			return i/evento.getInscricoes().size()*100;
		}
		return 0;
	}
}
