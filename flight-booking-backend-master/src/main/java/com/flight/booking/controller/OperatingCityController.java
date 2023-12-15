package com.flight.booking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flight.booking.model.OperatingCity;
import com.flight.booking.service.OperatingCityService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@RestController
@RequestMapping("flight")
@CrossOrigin
@Api(tags = { "Operating city" }, value = "operating city")
public class OperatingCityController {

	@Autowired
	private OperatingCityService operatingCityService;

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("secure/add-operating-cities")
	@ApiOperation(value = "add-operating-cities", nickname = "add-operating-cities", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponses({
			@ApiResponse(code = 200, message = "Ok", response = OperatingCity.class, responseContainer = "List") })
	public List<OperatingCity> addOperatingCitis(@RequestHeader("AccessToken") String token,
			@RequestBody List<OperatingCity> operatingCities) {
		return operatingCityService.addOperatingCitis(operatingCities);
	}

	@GetMapping("public/active-operating-cities")
	@ApiOperation(value = "active-operating-cities", nickname = "active-operating-cities", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponses({
			@ApiResponse(code = 200, message = "Ok", response = OperatingCity.class, responseContainer = "List") })
	public List<OperatingCity> getActiveOperatingCities() {
		return operatingCityService.getAllOperatingCities(false);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("secure/all-operating-cities")
	@ApiOperation(value = "all-operating-cities", nickname = "all-operating-cities", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponses({
			@ApiResponse(code = 200, message = "Ok", response = OperatingCity.class, responseContainer = "List") })
	public List<OperatingCity> getAllOperatingCities(@RequestHeader("AccessToken") String token) {
		return operatingCityService.getAllOperatingCities(true);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("secure/update-operating-cities")
	@ApiOperation(value = "update-operating-cities", nickname = "update-operating-cities", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponses({
			@ApiResponse(code = 200, message = "Ok", response = OperatingCity.class, responseContainer = "List") })
	public List<OperatingCity> updateOperatingCities(@RequestHeader("AccessToken") String token,
			@RequestBody List<OperatingCity> operatingCities) {
		return operatingCityService.updateOperatingCities(operatingCities);
	}

}
