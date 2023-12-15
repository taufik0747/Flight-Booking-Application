package com.flight.booking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flight.booking.model.Pnr;
import com.flight.booking.model.TicketDetails;
import com.flight.booking.service.FlightBookingService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@RestController
@RequestMapping("flight")
@CrossOrigin
@Api(tags = { "Flight booking" }, value = "flight booking")
public class FlightBookingController {

	@Autowired
	private FlightBookingService bookingService;

	@PostMapping("secure/book")
	@ApiOperation(value = "book", nickname = "book", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponses({ @ApiResponse(code = 200, message = "Ok", response = Pnr.class) })
	public Pnr bookPnr(@RequestHeader("AccessToken") String token, @RequestBody Pnr pnr) {
		return bookingService.bookPnr(pnr);
	}

	@GetMapping("secure/search-pnr")
	@ApiOperation(value = "search-pnr", nickname = "search-pnr", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponses({ @ApiResponse(code = 200, message = "Ok", response = Pnr.class) })
	public Pnr searchPnr(@RequestHeader("AccessToken") String token,
			@RequestParam(name = "pnr", required = true) String pnrNumber) {
		return bookingService.searchPnr(pnrNumber);
	}

	@GetMapping("secure/search-ticket")
	@ApiOperation(value = "search-ticket", nickname = "search-ticket", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponses({ @ApiResponse(code = 200, message = "Ok", response = TicketDetails.class) })
	public TicketDetails searchTicket(@RequestHeader("AccessToken") String token,
			@RequestParam(name = "ticket", required = true) String ticketNumber) {
		return bookingService.searchTicket(ticketNumber);
	}

	@GetMapping("secure/download-ticket")
	@ApiOperation(value = "download-ticket", nickname = "download-ticket", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponses({ @ApiResponse(code = 200, message = "Ok", response = String.class) })
	public String downloadTicket(@RequestParam(name = "ticket", required = true) String ticketNumber) {
		return bookingService.downloadTicket(ticketNumber);
	}

	@GetMapping("secure/search-pnr-by-user")
	@ApiOperation(value = "earch-pnr-by-user", nickname = "earch-pnr-by-user", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponses({ @ApiResponse(code = 200, message = "Ok", response = Pnr.class, responseContainer = "List") })
	public List<Pnr> searchPnrByUser(@RequestHeader("AccessToken") String token,
			@RequestParam(name = "email", required = true) String email) {
		return bookingService.searchPnrByUser(email);
	}

}
